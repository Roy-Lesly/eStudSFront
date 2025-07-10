import QRCode from 'qrcode';

export const QrCodeBase64 = async (text: string): Promise<string> => {
  try {
    const base64 = await QRCode.toDataURL(text);
    return base64;
  } catch (error: any) {
    console.error('QR generation error:', error);
    return '';
  }
};
