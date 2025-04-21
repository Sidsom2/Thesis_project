import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import io
import base64

def generate_plot(df, graph_type, cols):
    plt.figure(figsize=(10, 6))
    plt.clf()
    if graph_type == "hist":
        for col in cols:
            sns.histplot(df[col], kde=True, label=col)
        plt.legend()
    elif graph_type == "scatter":
        if len(cols) >= 2:
            sns.scatterplot(x=df[cols[0]], y=df[cols[1]])
    elif graph_type == "box":
        sns.boxplot(data=df[cols])
        plt.xticks(rotation=45)
    elif graph_type == "heatmap":
        corr = df[cols].corr()
        sns.heatmap(corr, annot=True, cmap="coolwarm")
    
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png')
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

def compute_stats(df):
    stats = df.describe().to_dict()
    mode = df.mode().iloc[0].to_dict()
    for col in df.columns:
        stats[col]["mode"] = mode.get(col, None)
    return stats
