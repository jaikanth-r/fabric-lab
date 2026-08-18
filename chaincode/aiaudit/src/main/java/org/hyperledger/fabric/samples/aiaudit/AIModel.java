package org.hyperledger.fabric.samples.aiaudit;

import com.google.gson.annotations.SerializedName;

public class AIModel {
    @SerializedName("modelID")
    private String modelID;

    @SerializedName("hashValue")
    private String hashValue;

    @SerializedName("owner")
    private String owner;

    @SerializedName("timestamp")
    private String timestamp;

    public AIModel(String modelID, String hashValue, String owner, String timestamp) {
        this.modelID = modelID;
        this.hashValue = hashValue;
        this.owner = owner;
        this.timestamp = timestamp;
    }
}
