import { WorkOS } from '@workos-inc/node';

// Initialize WorkOS client only if API key is available
let workos: WorkOS | null = null;

try {
    if (process.env.WORKOS_API_KEY) {
        workos = new WorkOS(process.env.WORKOS_API_KEY);
        console.log('✅ WorkOS MFA client initialized');
    } else {
        console.warn('⚠️ WORKOS_API_KEY not configured. SMS OTP will use fallback mode.');
    }
} catch (error) {
    console.error('❌ Failed to initialize WorkOS client:', error);
}

export interface EnrollSMSFactorResult {
    factorId: string;
    success: boolean;
    error?: string;
}

export interface CreateSMSChallengeResult {
    challengeId: string;
    success: boolean;
    error?: string;
}

export interface VerifySMSChallengeResult {
    success: boolean;
    valid: boolean;
    error?: string;
}

/**
 * Enrolls a phone number for SMS authentication
 * @param phoneNumber - Phone number in E.164 format
 * @returns Factor ID and success status
 */
export async function enrollSMSFactor(
    phoneNumber: string
): Promise<EnrollSMSFactorResult> {
    try {
        if (!workos) {
            console.warn('⚠️ WorkOS not initialized, skipping SMS factor enrollment');
            return {
                factorId: '',
                success: false,
                error: 'WorkOS not configured',
            };
        }

        console.log('📱 Enrolling SMS factor for:', phoneNumber);

        // Create an authentication factor for SMS
        const factor = await workos.mfa.enrollFactor({
            type: 'sms',
            phoneNumber,
        });

        console.log('✅ SMS factor enrolled:', factor.id);

        return {
            factorId: factor.id,
            success: true,
        };
    } catch (error) {
        console.error('❌ Error enrolling SMS factor:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        if (error && typeof error === 'object') {
            console.error('Error name:', (error as any).name);
            console.error('Error message:', (error as any).message);
            console.error('Error stack:', (error as any).stack);
            if ((error as any).response) {
                console.error('API Response status:', (error as any).response.status);
                console.error('API Response data:', (error as any).response.data);
            }
        }
        return {
            factorId: '',
            success: false,
            error: error instanceof Error ? error.message : 'Failed to enroll SMS factor',
        };
    }
}

/**
 * Creates an SMS challenge (sends OTP)
 * @param factorId - The authentication factor ID
 * @param smsTemplate - Optional custom SMS template (use {{code}} for OTP)
 * @returns Challenge ID and success status
 */
export async function createSMSChallenge(
    factorId: string,
    smsTemplate?: string
): Promise<CreateSMSChallengeResult> {
    try {
        if (!workos) {
            console.warn('⚠️ WorkOS not initialized, skipping SMS challenge creation');
            return {
                challengeId: '',
                success: false,
                error: 'WorkOS not configured',
            };
        }

        console.log('📱 Creating SMS challenge for factor:', factorId);

        const challenge = await workos.mfa.challengeFactor({
            authenticationFactorId: factorId,
            smsTemplate: smsTemplate || 'Your DoodLance verification code is {{code}}. It expires in 10 minutes.',
        });

        console.log('✅ SMS challenge created:', challenge.id);

        return {
            challengeId: challenge.id,
            success: true,
        };
    } catch (error) {
        console.error('❌ Error creating SMS challenge:', error);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        if (error && typeof error === 'object') {
            console.error('Error details:', {
                name: (error as any).name,
                message: (error as any).message,
                status: (error as any).response?.status,
                data: (error as any).response?.data
            });
        }
        return {
            challengeId: '',
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create SMS challenge',
        };
    }
}

/**
 * Verifies an SMS challenge with the provided code
 * @param challengeId - The challenge ID
 * @param code - The OTP code to verify
 * @returns Verification result
 */
export async function verifySMSChallenge(
    challengeId: string,
    code: string
): Promise<VerifySMSChallengeResult> {
    try {
        if (!workos) {
            console.warn('⚠️ WorkOS not initialized, skipping SMS challenge verification');
            return {
                success: false,
                valid: false,
                error: 'WorkOS not configured',
            };
        }

        console.log('🔍 Verifying SMS challenge:', challengeId);

        const result = await workos.mfa.verifyChallenge({
            authenticationChallengeId: challengeId,
            code,
        });

        console.log('✅ SMS challenge verified:', result.valid);

        return {
            success: true,
            valid: result.valid,
        };
    } catch (error) {
        console.error('❌ Error verifying SMS challenge:', error);
        return {
            success: false,
            valid: false,
            error: error instanceof Error ? error.message : 'Failed to verify SMS challenge',
        };
    }
}

/**
 * Deletes an authentication factor
 * @param factorId - The factor ID to delete
 */
export async function deleteSMSFactor(factorId: string): Promise<boolean> {
    try {
        if (!workos) {
            console.warn('⚠️ WorkOS not initialized, skipping SMS factor deletion');
            return false;
        }

        await workos.mfa.deleteFactor(factorId);
        return true;
    } catch (error) {
        console.error('Error deleting SMS factor:', error);
        return false;
    }
}

export { workos };
