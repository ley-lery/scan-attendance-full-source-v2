import axios from 'axios';

interface ScanData {
    classId: number | null,
    studentId: number | null,
    dayOfWeek: string | null,
    targetTime: string | null
}

// ============= Enhanced Error Types =============
export interface ApiError {
    type: 'network' | 'server' | 'validation' | 'not_found' | 'already_scanned' | 'location' | 'time_slot' | 'unknown';
    message: string;
    details?: any;
}

// ============= API Configuration =============
export const API_CONFIG = {
    BASE_URL: 'http://192.168.2.2:7700/v1/api',
    ENDPOINTS: {
        CREATE_ATTENDANCE: '/attendance/mobile/scan/process',
    },
    TIMEOUT: 10000,
};

// ============= Enhanced API Service =============
export class AttendanceApiService {
    private static instance: AttendanceApiService;
    private axiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
    }

    static getInstance(): AttendanceApiService {
        if (!AttendanceApiService.instance) {
            AttendanceApiService.instance = new AttendanceApiService();
        }
        return AttendanceApiService.instance;
    }

    // Fetch student list from QR data
    async fetchClassList(qrData: string): Promise<{ success: boolean; data?: any[]; error?: ApiError }> {
        try {
            console.log('Fetching student list with QR data:', qrData);
            
            const response = await this.axiosInstance.get(qrData);
            
            // Check if response is valid
            if (!response.data || !response.data.data) {
                return {
                    success: false,
                    error: {
                        type: 'server',
                        message: 'Invalid response format from server',
                        details: response.data
                    }
                };
            }

            const classData = response.data.data;
            console.log('class fetched:', classData);
            
            return {
                success: true,
                data: classData
            };

        } catch (error: any) {
            console.error('API Error:', error);
            
            // Enhanced error handling
            if (error.code === 'ECONNABORTED') {
                return {
                    success: false,
                    error: {
                        type: 'network',
                        message: 'Request timeout - please check your connection',
                        details: error
                    }
                };
            } else if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const statusText = error.response.statusText;
                
                if (status === 404) {
                    return {
                        success: false,
                        error: {
                            type: 'not_found',
                            message: 'QR code not found or invalid session',
                            details: error.response.data
                        }
                    };
                } else if (status >= 500) {
                    return {
                        success: false,
                        error: {
                            type: 'server',
                            message: 'Server error - please try again later',
                            details: { status, statusText }
                        }
                    };
                } else {
                    return {
                        success: false,
                        error: {
                            type: 'validation',
                            message: error.response.data?.message || 'Invalid request',
                            details: error.response.data
                        }
                    };
                }
            } else if (error.request) {
                // Network error
                return {
                    success: false,
                    error: {
                        type: 'network',
                        message: 'Network error - please check your internet connection',
                        details: error
                    }
                };
            } else {
                return {
                    success: false,
                    error: {
                        type: 'unknown',
                        message: 'An unexpected error occurred',
                        details: error
                    }
                };
            }
        }
    }

    // Process attendance with enhanced error handling
    async ProcessAttendance(payload: ScanData): Promise<{ success: boolean; data?: any; error?: ApiError }> {
        try {
            console.log('Processing attendance with payload:', payload);
            
            const response = await this.axiosInstance.post(
                API_CONFIG.ENDPOINTS.CREATE_ATTENDANCE, 
                payload
            );
            
            console.log('Attendance processed successfully:', response.data);
            
            return {
                success: true,
                data: response.data.data || response.data
            };

        } catch (error: any) {
            console.error('Attendance processing failed:', error);
            
            // Enhanced error handling
            if (error.code === 'ECONNABORTED') {
                return {
                    success: false,
                    error: {
                        type: 'network',
                        message: 'Request timeout - please check your connection',
                        details: error
                    }
                };
            } else if (error.response) {
                const status = error.response.status;
                const errorData = error.response.data;
                const errorMessage = errorData?.message || error.response.statusText;
                
                // Check for specific error types based on message content
                if (errorMessage.includes('time slot') || errorMessage.includes('outside allowed time')) {
                    return {
                        success: false,
                        error: {
                            type: 'time_slot',
                            message: errorMessage,
                            details: errorData
                        }
                    };
                } else if (errorMessage.includes('already scanned') || errorMessage.includes('duplicate')) {
                    return {
                        success: false,
                        error: {
                            type: 'already_scanned',
                            message: errorMessage,
                            details: errorData
                        }
                    };
                } else if (status === 404) {
                    return {
                        success: false,
                        error: {
                            type: 'not_found',
                            message: errorMessage || 'Record not found',
                            details: errorData
                        }
                    };
                } else if (status >= 500) {
                    return {
                        success: false,
                        error: {
                            type: 'server',
                            message: 'Server error - please try again later',
                            details: { status, errorMessage }
                        }
                    };
                } else if (status >= 400) {
                    return {
                        success: false,
                        error: {
                            type: 'validation',
                            message: errorMessage || 'Invalid request',
                            details: errorData
                        }
                    };
                }
            } else if (error.request) {
                return {
                    success: false,
                    error: {
                        type: 'network',
                        message: 'Network error - please check your internet connection',
                        details: error
                    }
                };
            }
            
            // Default unknown error
            return {
                success: false,
                error: {
                    type: 'unknown',
                    message: error?.message || 'An unexpected error occurred',
                    details: error
                }
            };
        }
    }
}

// Default export for the service instance
export default AttendanceApiService.getInstance();