package org.hyperledger.fabric.samples.aiaudit;

import com.google.gson.annotations.SerializedName;

public class AIModel {
    @SerializedName("modelID")
    private final String modelID;
    
    @SerializedName("hashValue")
    private final String hashValue;
    
    @SerializedName("owner")
    private final String owner;

    public AIModel(String modelID, String hashValue, String owner) {
        this.modelID = modelID;
        this.hashValue = hashValue;
        this.owner = owner;
    }

    public String getModelID() { return modelID; }
    public String getHashValue() { return hashValue; }
    public String getOwner() { return owner; }
}
