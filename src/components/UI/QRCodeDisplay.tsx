import React, { useState } from 'react';
import { Copy, Mail, RefreshCw, Eye, EyeOff, Download } from 'lucide-react';
import Button from './Button';
import Card from './Card';
import { QRCodeData, formatQRCodeForDisplay, regenerateQRCode } from '../../utils/qrCodeGenerator';

interface QRCodeDisplayProps {
  qrCodeData: QRCodeData;
  onRegenerate?: (newQRCode: QRCodeData) => void;
  showActions?: boolean;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ 
  qrCodeData, 
  onRegenerate,
  showActions = true 
}) => {
  const [showFullCode, setShowFullCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyQRCode = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy QR code:', error);
    }
  };

  const handleCopyFullDetails = async () => {
    try {
      const formattedData = formatQRCodeForDisplay(qrCodeData);
      await navigator.clipboard.writeText(formattedData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy details:', error);
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      const newQRCode = regenerateQRCode(qrCodeData);
      onRegenerate(newQRCode);
    }
  };

  const handleEmailQRCode = () => {
    const subject = encodeURIComponent(`QR Code for ${qrCodeData.companyName} - Holdings CTC Portal Access`);
    const body = encodeURIComponent(formatQRCodeForDisplay(qrCodeData));
    const mailtoLink = `mailto:${qrCodeData.email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  const handleDownload = () => {
    const formattedData = formatQRCodeForDisplay(qrCodeData);
    const blob = new Blob([formattedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR_Code_${qrCodeData.companyName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isExpired = qrCodeData.expiresAt && new Date() > new Date(qrCodeData.expiresAt);

  return (
    <Card className={`${isExpired ? 'border-warning-300 bg-warning-50' : 'border-success-300 bg-success-50'}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Client QR Code
          </h3>
          {isExpired && (
            <span className="text-sm text-warning-600 font-medium">
              Expired
            </span>
          )}
        </div>

        {/* Client Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Company:</span>
            <p className="text-gray-900">{qrCodeData.companyName}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Contact:</span>
            <p className="text-gray-900">{qrCodeData.contactName}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Email:</span>
            <p className="text-gray-900">{qrCodeData.email}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Generated:</span>
            <p className="text-gray-900">
              {new Date(qrCodeData.generatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-700">QR Code:</span>
            <Button
              variant="ghost"
              size="sm"
              icon={showFullCode ? EyeOff : Eye}
              onClick={() => setShowFullCode(!showFullCode)}
            >
              {showFullCode ? 'Hide' : 'Show'}
            </Button>
          </div>
          
          <div className="font-mono text-sm bg-gray-50 p-3 rounded border">
            {showFullCode ? qrCodeData.qrCode : `${qrCodeData.qrCode.substring(0, 20)}...`}
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              icon={Copy}
              onClick={handleCopyQRCode}
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>
        </div>

        {/* Expiration Info */}
        {qrCodeData.expiresAt && (
          <div className={`text-sm p-3 rounded-lg ${
            isExpired 
              ? 'bg-warning-100 text-warning-800' 
              : 'bg-info-100 text-info-800'
          }`}>
            <span className="font-medium">
              {isExpired ? 'Expired on: ' : 'Expires on: '}
            </span>
            {new Date(qrCodeData.expiresAt).toLocaleDateString()}
            {isExpired && (
              <span className="block mt-1 text-xs">
                This QR code has expired and needs to be regenerated for security.
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              icon={Mail}
              onClick={handleEmailQRCode}
            >
              Email to Client
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleDownload}
            >
              Download
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              icon={Copy}
              onClick={handleCopyFullDetails}
            >
              Copy All Details
            </Button>
            
            {onRegenerate && (
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={handleRegenerate}
                className={isExpired ? 'border-warning-300 text-warning-700 hover:bg-warning-50' : ''}
              >
                {isExpired ? 'Regenerate (Expired)' : 'Regenerate'}
              </Button>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4 text-sm">
          <h4 className="font-medium text-blue-900 mb-2">Client Instructions:</h4>
          <ol className="text-blue-800 space-y-1 list-decimal list-inside">
            <li>Visit the Holdings CTC Support Portal</li>
            <li>Click "Set Up Account with QR Code"</li>
            <li>Enter the QR code provided above</li>
            <li>Follow the guided 2FA setup process</li>
            <li>Access the client portal with secure authentication</li>
          </ol>
        </div>
      </div>
    </Card>
  );
};

export default QRCodeDisplay;