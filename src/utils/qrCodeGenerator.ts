/**
 * QR Code Generator Utility
 * Generates unique QR codes for client onboarding with AWS DynamoDB integration
 */

import { dynamoDBService } from '../services/dynamodb';

export interface QRCodeData {
  clientId: string;
  companyName: string;
  contactName: string;
  email: string;
  qrCode: string;
  generatedAt: string;
  expiresAt?: string;
  isValid: boolean;
}

/**
 * Generates a unique QR code for a client and stores it in DynamoDB
 */
export const generateClientQRCode = async (clientData: {
  clientId: string;
  companyName: string;
  contactName: string;
  email: string;
}): Promise<QRCodeData> => {
  // Generate a unique QR code identifier
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const companyCode = clientData.companyName
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 6)
    .toUpperCase();
  
  const qrCode = `QR_${companyCode}_${randomSuffix}_${timestamp}`;
  
  const qrCodeData: QRCodeData = {
    clientId: clientData.clientId,
    companyName: clientData.companyName,
    contactName: clientData.contactName,
    email: clientData.email,
    qrCode,
    generatedAt: new Date().toISOString(),
    // QR codes expire after 30 days for security
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isValid: true,
  };

  // Store QR code in DynamoDB
  try {
    await dynamoDBService.createQRCode(qrCodeData);
  } catch (error) {
    console.error('Error storing QR code in DynamoDB:', error);
    // Continue with local generation for development
  }
  
  return qrCodeData;
};

/**
 * Validates if a QR code is still valid by checking DynamoDB
 */
export const validateQRCode = async (qrCode: string): Promise<QRCodeData | null> => {
  try {
    const qrCodeData = await dynamoDBService.validateQRCode(qrCode);
    return qrCodeData;
  } catch (error) {
    console.error('Error validating QR code:', error);
    return null;
  }
};

/**
 * Validates if a QR code is still valid (local check)
 */
export const isQRCodeValid = (qrCodeData: QRCodeData): boolean => {
  if (!qrCodeData.expiresAt) return true; // No expiration set
  
  const now = new Date();
  const expirationDate = new Date(qrCodeData.expiresAt);
  
  return now < expirationDate && qrCodeData.isValid;
};

/**
 * Regenerates a QR code for an existing client
 */
export const regenerateQRCode = async (existingData: QRCodeData): Promise<QRCodeData> => {
  return generateClientQRCode({
    clientId: existingData.clientId,
    companyName: existingData.companyName,
    contactName: existingData.contactName,
    email: existingData.email,
  });
};

/**
 * Formats QR code data for email/display purposes
 */
export const formatQRCodeForDisplay = (qrCodeData: QRCodeData): string => {
  return `
Client Onboarding QR Code
========================

Company: ${qrCodeData.companyName}
Contact: ${qrCodeData.contactName}
Email: ${qrCodeData.email}

QR Code: ${qrCodeData.qrCode}

Generated: ${new Date(qrCodeData.generatedAt).toLocaleDateString()}
${qrCodeData.expiresAt ? `Expires: ${new Date(qrCodeData.expiresAt).toLocaleDateString()}` : 'No expiration'}

Instructions:
1. Provide this QR code to the client
2. Client should visit the portal and click "Set Up Account with QR Code"
3. Client enters the QR code to begin secure account setup
4. Client will be guided through user setup and 2FA configuration

Note: This QR code is unique to this client and should be kept secure.
  `.trim();
};

/**
 * Extracts client information from a QR code
 * This validates against the DynamoDB database
 */
export const parseQRCode = async (qrCode: string): Promise<{ isValid: boolean; qrCodeData?: QRCodeData }> => {
  // Basic QR code format validation
  const qrPattern = /^QR_[A-Z0-9]+_[A-Z0-9]+_\d+$/;
  
  if (!qrPattern.test(qrCode)) {
    return { isValid: false };
  }
  
  try {
    // Validate against DynamoDB
    const qrCodeData = await validateQRCode(qrCode);
    
    if (qrCodeData && isQRCodeValid(qrCodeData)) {
      return { 
        isValid: true, 
        qrCodeData 
      };
    }
    
    return { isValid: false };
  } catch (error) {
    console.error('Error parsing QR code:', error);
    return { isValid: false };
  }
};

/**
 * Invalidates a QR code (marks as used/expired)
 */
export const invalidateQRCode = async (qrCode: string): Promise<boolean> => {
  try {
    const qrCodeData = await dynamoDBService.getQRCode(qrCode);
    if (qrCodeData) {
      // Mark as invalid
      await dynamoDBService.create('holdings-ctc-qr-codes', {
        ...qrCodeData,
        isValid: false,
        usedAt: new Date().toISOString(),
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error invalidating QR code:', error);
    return false;
  }
};