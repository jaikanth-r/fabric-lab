# AI-Audit: Model Integrity Ledger

A decentralized audit log for AI models built on **Hyperledger Fabric**. This project ensures that AI models haven't been tampered with by storing their cryptographic hashes on a permissioned ledger.

## Key Features
* **Glassmorphism UI:** Modern, transparent interface inspired by cosmos.so.
* **Blockchain Integration:** Connects to a Hyperledger Fabric network via a Gateway.
* **Real-time Auditing:** Instantly verify model history and integrity.

## Tech Stack
- **Frontend:** Next.js 15, Tailwind CSS
- **Blockchain:** Hyperledger Fabric v2.5, Docker
- **Language:** TypeScript

# Screenshots
![alt text](<Screenshot 2026-04-02 at 12.34.06 AM.png>)

## How to Run Locally
1. **Start the Network:** Run `./network.sh up` in the fabric-samples directory.
2. **Deploy Chaincode:** Deploy the `aiaudit` chaincode to `mychannel`.
3. **Run the App:**
   ```bash
   cd aiaudit-dapp
   npm install
   npm run dev
   \```

   ## Local Development & Live Demo (GitHub Codespace)

To run the full blockchain-backed DApp within a Codespace environment, follow these steps in order.

### 1. Initialize the Fabric Network
Start the permissioned network with a Certificate Authority (CA) and a default channel.
```bash
cd ~/fabric-samples/test-network
./network.sh up createChannel -c mychannel -ca
\```

### 2. Deploy the AI-Audit Chaincode
Install the TypeScript smart contract that handles the Model Integrity Ledger.
```bash
./network.sh deployCC -ccn aiaudit -ccp ../../workspaces/fabric-lab/chaincode -ccl typescript
\```

### 3. Launch the Next.js Frontend
Start the "Glassy" UI and connect it to the Fabric Gateway.
```bash
cd /workspaces/fabric-lab/aiaudit-dapp
npm install
npm run dev
\```

> **Note:** Once the server starts, VS Code will prompt you to "Open in Browser" on Port 3000.

### 4. Verify Docker Infrastructure
To prove the enterprise backend is running, you can monitor the containers:
```bash
docker ps
\```
