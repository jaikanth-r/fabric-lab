package org.hyperledger.fabric.samples.aiaudit;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.shim.ledger.KeyModification;
import org.hyperledger.fabric.shim.ledger.QueryResultsIterator;
import com.google.gson.Gson;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Contract(name = "AI-Audit")
@Default
public class AIContract implements ContractInterface {
    private final Gson gson = new Gson();

    @Transaction()
    public void auditModel(final Context ctx, final String modelID, final String hashValue, final String owner) {
        Instant timestamp = ctx.getStub().getTxTimestamp();
        AIModel model = new AIModel(modelID, hashValue, owner, timestamp.toString());
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

    @Transaction()
    public String getModelHistory(final Context ctx, final String modelID) {
        QueryResultsIterator<KeyModification> results = ctx.getStub().getHistoryForKey(modelID);
        List<String> history = new ArrayList<>();

        for (KeyModification mod : results) {
            history.add(String.format("TxId: %s, Value: %s", mod.getTxId(), mod.getStringValue()));
        }

        return history.toString();
    }
}
