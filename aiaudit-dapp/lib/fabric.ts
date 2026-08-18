import { Gateway, Wallets } from 'fabric-network';
import path from 'path';
import fs from 'fs';

export async function getBlockchainContract() {
    const fabricSamplesPath = process.env.FABRIC_SAMPLES_PATH ||
        path.resolve(process.cwd(), '..', 'fabric-samples');

    const ccpPath = path.resolve(fabricSamplesPath, 'test-network', 'organizations',
        'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get('appUser');
    if (!identity) {
        throw new Error("CRITICAL: IDENTITY_NOT_FOUND_IN_WALLET. Run 'npm run enroll' first.");
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');
    return { contract: network.getContract('aiaudit'), gateway };
}
