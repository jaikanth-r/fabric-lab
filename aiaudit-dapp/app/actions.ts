'use server'
import { getBlockchainContract } from '@/lib/fabric';

export async function getModelHistory(modelId: string) {
    try {
        const { contract, gateway } = await getBlockchainContract();
        const resultBuffer = await contract.evaluateTransaction('AI-Audit:getModelHistory', modelId);
        await gateway.disconnect();

        const resultString = resultBuffer.toString();
        if (!resultString || resultString === '[]') {
            return { success: true, data: [] };
        }

        // Parse "[TxId: xxx, Value: {...}]" style history string into objects
        const entries = resultString.slice(1, -1).split(/(?<=}), (?=TxId:)/);
        const data = entries.map(entry => {
            const txMatch = entry.match(/TxId:\s*([a-f0-9]+)/);
            const valueMatch = entry.match(/Value:\s*({.*})/s);
            return {
                TxId: txMatch?.[1] || '',
                Value: valueMatch ? JSON.parse(valueMatch[1]) : {}
            };
        });

        return { success: true, data };
    } catch (error: any) {
        console.error(">>> [WEB3_SYSTEM] QUERY_FAILED:", error.message);
        return { success: false, error: error.message, data: [] };
    }
}

export async function createAuditRecord(modelId: string, hashValue: string, owner: string) {
    try {
        const { contract, gateway } = await getBlockchainContract();
        await contract.submitTransaction('AI-Audit:auditModel', modelId, hashValue, owner);
        await gateway.disconnect();
        return { success: true };
    } catch (error: any) {
        console.error(">>> [WEB3_SYSTEM] WRITE_FAILED:", error.message);
        return { success: false, error: error.message };
    }
}
