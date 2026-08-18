package org.hyperledger.fabric.samples.aiaudit;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Transaction;
import com.google.gson.Gson;

@Contract(name = "AI-Audit")
@Default
public class AIContract implements ContractInterface {
    private final Gson gson = new Gson();

    @Transaction()
    public void initLedger(final Context ctx) {
        // Initial state if needed
    }

    @Transaction()
    public void auditModel(final Context ctx, final String modelID, final String hashValue, final String owner) {
        AIModel model = new AIModel(modelID, hashValue, owner);
        ctx.getStub().putStringState(modelID, gson.toJson(model));
    }

    @Transaction()
    public String verifyModel(final Context ctx, final String modelID) {
        String modelJSON = ctx.getStub().getStringState(modelID);
        if (modelJSON == null || modelJSON.isEmpty()) {
            throw new RuntimeException("Model " + modelID + " does not exist");
        }
        return modelJSON;
    }
}
