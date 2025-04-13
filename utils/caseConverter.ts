/**
 * Convert camelCase to snake_case
 * @param str - The camelCase string to convert
 * @returns The snake_case string
 */
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Convert snake_case to camelCase
 * @param str - The snake_case string to convert
 * @returns The camelCase string
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Convert an object's keys from camelCase to snake_case
 * @param obj - The object with camelCase keys
 * @returns A new object with snake_case keys
 */
export const camelToSnakeKeys = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  if (Array.isArray(obj)) {
    return obj.map(item => camelToSnakeKeys(item));
  }
  
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = camelToSnake(key);
      acc[snakeKey] = camelToSnakeKeys(obj[key]);
      return acc;
    }, {} as Record<string, any>);
  }
  
  return obj;
};

/**
 * Convert an object's keys from snake_case to camelCase
 * @param obj - The object with snake_case keys
 * @returns A new object with camelCase keys
 */
export const snakeToCamelKeys = <T extends Record<string, any>>(obj: T): Record<string, any> => {
  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamelKeys(item));
  }
  
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = snakeToCamel(key);
      acc[camelKey] = snakeToCamelKeys(obj[key]);
      return acc;
    }, {} as Record<string, any>);
  }
  
  return obj;
};

/**
 * Convert API request data from camelCase to snake_case
 * @param data - The request data with camelCase keys
 * @returns The request data with snake_case keys
 */
export const prepareRequestData = <T extends Record<string, any>>(data: T): Record<string, any> => {
  return camelToSnakeKeys(data);
};

/**
 * Convert API response data from snake_case to camelCase
 * @param data - The response data with snake_case keys
 * @returns The response data with camelCase keys
 */
export const processResponseData = <T extends Record<string, any>>(data: T): Record<string, any> => {
  return snakeToCamelKeys(data);
}; 