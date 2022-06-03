export function isKoResponse(response: any): boolean {
  return response?.error && (!response?.data || response?.result !== 'OK');
}

export function isNumeric(str: string) {
  if (typeof str != 'string') {
    return false;
  }
  return !isNaN(str as any) && !isNaN(parseInt(str));
}

export function getAuthorizationHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}
