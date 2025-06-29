/**
 * QR Code Generator Utility
 * Generates unique QR codes for client onboarding
 */

export interface QRCodeData {
  clientId: string;
  companyName: string;
  contactName: string;
  email: string;
  qrCode: string;
  generatedAt: string;
  expiresAt?: string;
}

/**
 * Generates a unique QR code for a client
 */
export const generateClientQRCode = (clientData: {
  clientId: string;
  companyName: string;
  contactName: string;
  email: string;
}): QRCodeData => {
  // Generate a unique QR code identifier
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const companyCode = clientData.companyName
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 6)
    .toUpperCase();
  
  const qrCode = `QR_${companyCode}_${randomSuffix}_${timestamp}`;
  
  return {
    clientId: clientData.clientId,
    companyName: clientData.companyName,
    contactName: clientData.contactName,
    email: clientData.email,
    qrCode,
    generatedAt: new Date().toISOString(),
    // QR codes expire after 30 days for security
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
};

/**
 * Validates if a QR code is still valid
 */
export const isQRCodeValid = (qrCodeData: QRCodeData): boolean => {
  if (!qrCodeData.expiresAt) return true; // No expiration set
  
  const now = new Date();
  const expirationDate = new Date(qrCodeData.expiresAt);
  
  return now < expirationDate;
};

/**
 * Regenerates a QR code for an existing client
 */
export const regenerateQRCode = (existingData: QRCodeData): QRCodeData => {
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
4. Client will be guided through 2FA setup process

Note: This QR code is unique to this client and should be kept secure.
  `.trim();
};

/**
 * Extracts client information from a QR code
 * This would typically validate against the database
 */
export const parseQRCode = (qrCode: string): { isValid: boolean; clientId?: string } => {
  // Basic QR code format validation
  const qrPattern = /^QR_[A-Z0-9]+_[A-Z0-9]+_\d+$/;
  
  if (!qrPattern.test(qrCode)) {
    return { isValid: false };
  }
  
  // In a real implementation, this would query the database
  // For now, we'll extract the timestamp and validate format
  const parts = qrCode.split('_');
  if (parts.length >= 4) {
    const timestamp = parseInt(parts[parts.length - 1]);
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    // Check if QR code is not older than 30 days
    if (timestamp > thirtyDaysAgo) {
      return { 
        isValid: true, 
        clientId: `client_${timestamp}` // Mock client ID based on timestamp
      };
    }
  }
  
  return { isValid: false };
};