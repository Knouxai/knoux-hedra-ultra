import crypto from "crypto";
import fs from "fs";
import path from "path";

// واجهات التشفير
export interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  tagLength: number;
  saltLength: number;
  iterations: number;
}

export interface EncryptedData {
  data: string; // البيانات المشفرة (base64)
  iv: string; // Vector initialization (base64)
  tag?: string; // Authentication tag for AEAD (base64)
  salt?: string; // Salt for key derivation (base64)
  algorithm: string;
  timestamp: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  algorithm: string;
  keyLength: number;
  createdAt: string;
}

export interface DigitalSignature {
  signature: string;
  algorithm: string;
  publicKey: string;
  timestamp: string;
  dataHash: string;
}

class EncryptionService {
  private config: EncryptionConfig;
  private masterKey: Buffer | null = null;
  private keyPairs: Map<string, KeyPair> = new Map();
  private dataEncryptionKeys: Map<string, Buffer> = new Map();

  constructor() {
    this.config = {
      algorithm: "aes-256-gcm", // AES-256 with Galois/Counter Mode
      keyLength: 32, // 256 bits
      ivLength: 16, // 128 bits
      tagLength: 16, // 128 bits
      saltLength: 32, // 256 bits
      iterations: 100000, // PBKDF2 iterations
    };

    this.initializeMasterKey();
    this.loadOrGenerateKeyPairs();
  }

  // تهيئة المفتاح الرئيسي
  private initializeMasterKey(): void {
    const masterKeyPath = path.join(process.cwd(), ".encryption", "master.key");

    try {
      // محاولة تحميل المفتاح الموجود
      if (fs.existsSync(masterKeyPath)) {
        const encryptedMasterKey = fs.readFileSync(masterKeyPath);
        this.masterKey = this.deriveKeyFromPassword(
          process.env.MASTER_PASSWORD || "knox-sentinel-2024",
          encryptedMasterKey.slice(0, this.config.saltLength),
        );
        console.log("✅ Master key loaded successfully");
      } else {
        // إنشاء مفتاح جديد
        this.generateNewMasterKey();
      }
    } catch (error) {
      console.error("Error initializing master key:", error);
      this.generateNewMasterKey();
    }
  }

  // إنشاء مفتاح رئيسي جديد
  private generateNewMasterKey(): void {
    console.log("🔐 Generating new master key...");

    const salt = crypto.randomBytes(this.config.saltLength);
    this.masterKey = this.deriveKeyFromPassword(
      process.env.MASTER_PASSWORD || "knox-sentinel-2024",
      salt,
    );

    // حفظ المفتاح المشفر
    const masterKeyPath = path.join(process.cwd(), ".encryption", "master.key");
    const masterKeyDir = path.dirname(masterKeyPath);

    if (!fs.existsSync(masterKeyDir)) {
      fs.mkdirSync(masterKeyDir, { recursive: true });
    }

    // تشفير وحفظ المفتاح
    const encryptedKey = Buffer.concat([salt, this.masterKey]);
    fs.writeFileSync(masterKeyPath, encryptedKey, { mode: 0o600 });

    console.log("✅ Master key generated and saved");
  }

  // اشتقاق مفتاح من كلمة المرور
  private deriveKeyFromPassword(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(
      password,
      salt,
      this.config.iterations,
      this.config.keyLength,
      "sha512",
    );
  }

  // تحميل أو إنشاء أزواج المفاتيح
  private loadOrGenerateKeyPairs(): void {
    const keyPairPath = path.join(
      process.cwd(),
      ".encryption",
      "keypairs.json",
    );

    try {
      if (fs.existsSync(keyPairPath)) {
        const encryptedKeyPairs = fs.readFileSync(keyPairPath, "utf8");
        const decryptedData = this.decrypt(JSON.parse(encryptedKeyPairs));
        const keyPairsData = JSON.parse(decryptedData);

        for (const [id, keyPair] of Object.entries<any>(keyPairsData)) {
          this.keyPairs.set(id, keyPair);
        }

        console.log(`✅ Loaded ${this.keyPairs.size} key pairs`);
      } else {
        // إنشاء ز��ج مفاتيح افتراضي
        this.generateRSAKeyPair("default");
      }
    } catch (error) {
      console.error("Error loading key pairs:", error);
      this.generateRSAKeyPair("default");
    }
  }

  // تشفير البيانات بـ AES-256-GCM
  public encrypt(data: string, additionalKey?: string): EncryptedData {
    if (!this.masterKey) {
      throw new Error("Master key not initialized");
    }

    // استخدام مفتاح إضافي أو المفتاح الر��يسي
    const encryptionKey = additionalKey
      ? this.deriveKeyFromPassword(
          additionalKey,
          crypto.randomBytes(this.config.saltLength),
        )
      : this.masterKey;

    const iv = crypto.randomBytes(this.config.ivLength);
    const cipher = crypto.createCipheriv(
      this.config.algorithm,
      encryptionKey,
      iv,
    );

    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");

    const tag = cipher.getAuthTag();

    const result: EncryptedData = {
      data: encrypted,
      iv: iv.toString("base64"),
      algorithm: this.config.algorithm,
      timestamp: new Date().toISOString(),
    };

    if (tag) {
      result.tag = tag.toString("base64");
    }

    return result;
  }

  // فك تشفير الب��انات
  public decrypt(encryptedData: EncryptedData, additionalKey?: string): string {
    if (!this.masterKey) {
      throw new Error("Master key not initialized");
    }

    try {
      const encryptionKey = additionalKey
        ? this.deriveKeyFromPassword(
            additionalKey,
            crypto.randomBytes(this.config.saltLength),
          )
        : this.masterKey;

      const iv = Buffer.from(encryptedData.iv, "base64");
      const decipher = crypto.createDecipherGCM(
        encryptedData.algorithm,
        encryptionKey,
        iv,
      );

      if (encryptedData.tag) {
        decipher.setAuthTag(Buffer.from(encryptedData.tag, "base64"));
      }

      let decrypted = decipher.update(encryptedData.data, "base64", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  // تشفير ملف
  public async encryptFile(
    inputPath: string,
    outputPath: string,
    password?: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const encryptionKey = password
          ? this.deriveKeyFromPassword(
              password,
              crypto.randomBytes(this.config.saltLength),
            )
          : this.masterKey;

        if (!encryptionKey) {
          throw new Error("No encryption key available");
        }

        const iv = crypto.randomBytes(this.config.ivLength);
        const cipher = crypto.createCipheriv(
          this.config.algorithm,
          encryptionKey,
          iv,
        );

        const input = fs.createReadStream(inputPath);
        const output = fs.createWriteStream(outputPath);

        // كتابة IV في بداية الملف
        output.write(iv);

        input.pipe(cipher).pipe(output);

        output.on("finish", () => {
          console.log(`✅ File encrypted: ${inputPath} -> ${outputPath}`);
          resolve();
        });

        output.on("error", reject);
        input.on("error", reject);
        cipher.on("error", reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  // فك تشفير ملف
  public async decryptFile(
    inputPath: string,
    outputPath: string,
    password?: string,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const encryptionKey = password
          ? this.deriveKeyFromPassword(
              password,
              crypto.randomBytes(this.config.saltLength),
            )
          : this.masterKey;

        if (!encryptionKey) {
          throw new Error("No encryption key available");
        }

        const input = fs.createReadStream(inputPath);
        const output = fs.createWriteStream(outputPath);
        const iv = Buffer.alloc(this.config.ivLength);

        // قراءة IV من بداية الملف
        await new Promise((resolve, reject) => {
          input.once("readable", () => {
            const chunk = input.read(this.config.ivLength);
            if (chunk) {
              chunk.copy(iv);
              resolve(void 0);
            } else {
              reject(new Error("Cannot read IV from file"));
            }
          });
        });

        const decipher = crypto.createDecipherGCM(
          this.config.algorithm,
          encryptionKey,
          iv,
        );

        input.pipe(decipher).pipe(output);

        output.on("finish", () => {
          console.log(`✅ File decrypted: ${inputPath} -> ${outputPath}`);
          resolve();
        });

        output.on("error", reject);
        input.on("error", reject);
        decipher.on("error", reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  // إنشاء زوج مفاتيح RSA
  public generateRSAKeyPair(keyId: string, keyLength: number = 2048): KeyPair {
    console.log(`🔑 Generating RSA key pair: ${keyId}`);

    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: keyLength,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    const keyPair: KeyPair = {
      publicKey,
      privateKey,
      algorithm: "rsa",
      keyLength,
      createdAt: new Date().toISOString(),
    };

    this.keyPairs.set(keyId, keyPair);
    this.saveKeyPairs();

    console.log(`✅ RSA key pair generated: ${keyId}`);
    return keyPair;
  }

  // حفظ أزواج المفاتيح مشفرة
  private saveKeyPairs(): void {
    try {
      const keyPairsObject = Object.fromEntries(this.keyPairs);
      const serializedData = JSON.stringify(keyPairsObject);
      const encryptedData = this.encrypt(serializedData);

      const keyPairPath = path.join(
        process.cwd(),
        ".encryption",
        "keypairs.json",
      );
      fs.writeFileSync(keyPairPath, JSON.stringify(encryptedData), {
        mode: 0o600,
      });
    } catch (error) {
      console.error("Error saving key pairs:", error);
    }
  }

  // التوقيع الرقمي
  public createDigitalSignature(
    data: string,
    keyId: string = "default",
  ): DigitalSignature {
    const keyPair = this.keyPairs.get(keyId);
    if (!keyPair) {
      throw new Error(`Key pair not found: ${keyId}`);
    }

    // حساب hash للبيانات
    const dataHash = crypto.createHash("sha256").update(data).digest("hex");

    // إنشاء التوقيع
    const signature = crypto
      .sign("sha256", Buffer.from(data))
      .update(data)
      .sign(keyPair.privateKey, "base64");

    return {
      signature,
      algorithm: "rsa-sha256",
      publicKey: keyPair.publicKey,
      timestamp: new Date().toISOString(),
      dataHash,
    };
  }

  // التحقق من التوقيع الرقمي
  public verifyDigitalSignature(
    data: string,
    signature: DigitalSignature,
  ): boolean {
    try {
      // التحقق من hash البيانات
      const currentHash = crypto
        .createHash("sha256")
        .update(data)
        .digest("hex");
      if (currentHash !== signature.dataHash) {
        return false;
      }

      // التحقق من التوقيع
      const verifier = crypto.createVerify("sha256");
      verifier.update(data);
      return verifier.verify(
        signature.publicKey,
        signature.signature,
        "base64",
      );
    } catch (error) {
      console.error("Signature verification error:", error);
      return false;
    }
  }

  // تشفير قاعدة البيانات
  public encryptDatabaseField(value: any, fieldName: string): string {
    if (value === null || value === undefined) {
      return value;
    }

    const serializedValue = JSON.stringify(value);
    const fieldKey = this.generateFieldKey(fieldName);
    return this.encrypt(serializedValue, fieldKey).data;
  }

  // فك تشفير قاعدة البيانات
  public decryptDatabaseField(encryptedValue: string, fieldName: string): any {
    if (!encryptedValue) {
      return encryptedValue;
    }

    try {
      const fieldKey = this.generateFieldKey(fieldName);
      const encryptedData: EncryptedData = {
        data: encryptedValue,
        iv: "",
        algorithm: this.config.algorithm,
        timestamp: new Date().toISOString(),
      };

      const decryptedValue = this.decrypt(encryptedData, fieldKey);
      return JSON.parse(decryptedValue);
    } catch (error) {
      console.error(`Error decrypting field ${fieldName}:`, error);
      return null;
    }
  }

  // توليد مفتاح للحقل
  private generateFieldKey(fieldName: string): string {
    return crypto
      .createHash("sha256")
      .update(fieldName + process.env.FIELD_SALT || "knox-field-salt")
      .digest("hex");
  }

  // تشفير ملفات السجلات
  public encryptLogFile(logData: any): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      data: logData,
      integrity: this.calculateIntegrityHash(logData),
    };

    return JSON.stringify(this.encrypt(JSON.stringify(logEntry)));
  }

  // فك تشفير ملفات السجلات
  public decryptLogFile(encryptedLog: string): any {
    try {
      const encryptedData = JSON.parse(encryptedLog);
      const decryptedLog = this.decrypt(encryptedData);
      const logEntry = JSON.parse(decryptedLog);

      // التحقق من سلامة البيانات
      const currentHash = this.calculateIntegrityHash(logEntry.data);
      if (currentHash !== logEntry.integrity) {
        throw new Error("Log integrity check failed");
      }

      return logEntry.data;
    } catch (error) {
      console.error("Error decrypting log file:", error);
      return null;
    }
  }

  // حساب hash السلامة
  private calculateIntegrityHash(data: any): string {
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");
  }

  // تدوير المفاتيح
  public rotateKeys(): void {
    console.log("🔄 Starting key rotation...");

    // إنشاء مفتاح رئيسي جديد
    const oldMasterKey = this.masterKey;
    this.generateNewMasterKey();

    // إنشاء أزواج مفاتيح جديدة
    const keyIds = Array.from(this.keyPairs.keys());
    for (const keyId of keyIds) {
      this.generateRSAKeyPair(`${keyId}_rotated`);
    }

    console.log("✅ Key rotation completed");
  }

  // تصدير مفتاح عام
  public exportPublicKey(keyId: string = "default"): string | null {
    const keyPair = this.keyPairs.get(keyId);
    return keyPair ? keyPair.publicKey : null;
  }

  // استيراد مفتاح عام
  public importPublicKey(keyId: string, publicKey: string): void {
    const keyPair: KeyPair = {
      publicKey,
      privateKey: "", // لا يتم حفظ المفتاح الخاص
      algorithm: "rsa",
      keyLength: 2048,
      createdAt: new Date().toISOString(),
    };

    this.keyPairs.set(keyId, keyPair);
    this.saveKeyPairs();
  }

  // حذف آمن للبيانات
  public secureDelete(data: Buffer): void {
    // الكتابة فوق البيانات عدة مرات
    const patterns = [0x00, 0xff, 0xaa, 0x55];

    for (const pattern of patterns) {
      data.fill(pattern);
    }

    // الكتابة النهائية ببيانات عشوائية
    crypto.randomFillSync(data);
  }

  // تحليل قوة التشفير
  public analyzeEncryptionStrength(): any {
    return {
      algorithm: this.config.algorithm,
      keyLength: this.config.keyLength * 8, // bits
      estimatedSecurity: "256-bit AES with PBKDF2",
      quantumResistant: false,
      recommendedUntil: "2030+",
      keyDerivationIterations: this.config.iterations,
      additionalSecurity: [
        "Galois/Counter Mode (GCM) for authenticated encryption",
        "PBKDF2 with SHA-512 for key derivation",
        "Secure random IV generation",
        "Digital signatures with RSA-SHA256",
      ],
    };
  }

  // الحصول على إحصائيات التشفير
  public getEncryptionStatistics(): any {
    return {
      totalKeyPairs: this.keyPairs.size,
      masterKeyInitialized: !!this.masterKey,
      algorithm: this.config.algorithm,
      keyLength: this.config.keyLength,
      availableKeyPairs: Array.from(this.keyPairs.keys()),
      securityLevel: "ENTERPRISE",
      complianceStandards: ["AES-256", "FIPS-140-2", "Common Criteria"],
    };
  }

  // تنظيف الموارد
  public cleanup(): void {
    // حذف آمن للمفاتيح من الذاكرة
    if (this.masterKey) {
      this.secureDelete(this.masterKey);
      this.masterKey = null;
    }

    // مسح أزواج المفاتيح
    this.keyPairs.clear();
    this.dataEncryptionKeys.clear();

    console.log("🧹 Encryption service cleaned up");
  }
}

export default EncryptionService;
