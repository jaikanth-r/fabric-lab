// Imports the pre-generated User1@org1 identity (created by cryptogen when
// test-network was brought up) into a local file-system wallet that
// lib/fabric.ts reads from. Run this once after the network is up and the
// aiaudit chaincode is committed.
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
  const fabricSamplesPath = process.env.FABRIC_SAMPLES_PATH ||
    path.resolve(process.cwd(), '..', 'fabric-samples');

  const identityPath = path.resolve(fabricSamplesPath, 'test-network', 'organizations',
    'peerOrganizations', 'org1.example.com', 'users', 'User1@org1.example.com', 'msp');

  const certPath = path.join(identityPath, 'signcerts', 'cert.pem');
  const keyDir = path.join(identityPath, 'keystore');
  const keyFile = fs.readdirSync(keyDir).find(f => !f.startsWith('.'));

  if (!fs.existsSync(certPath) || !keyFile) {
    throw new Error(`Could not find User1 identity files under ${identityPath}. ` +
      `Make sure the test-network is up and FABRIC_SAMPLES_PATH points to the right fabric-samples clone.`);
  }

  const certificate = fs.readFileSync(certPath).toString();
  const privateKey = fs.readFileSync(path.join(keyDir, keyFile)).toString();

  const walletPath = path.join(process.cwd(), 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  if (await wallet.get('appUser')) {
    console.log('appUser already exists in wallet');
    return;
  }

  await wallet.put('appUser', {
    credentials: { certificate, privateKey },
    mspId: 'Org1MSP',
    type: 'X.509',
  });

  console.log(`Imported User1@org1.example.com into the wallet as 'appUser'`);
}

main().catch(err => {
  console.error('Failed to import appUser:', err);
  process.exit(1);
});
