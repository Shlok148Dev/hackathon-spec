import logging
import numpy as np
from sklearn.ensemble import IsolationForest

logger = logging.getLogger(__name__)

class AnomalyDetector:
    def __init__(self):
        # Pre-trained or statically initialized for hackathon
        self.clf = IsolationForest(random_state=42, contamination=0.1)
        # Mock training data to initialize the fitter
        # Features: [error_rate_1h, ticket_velocity, merchant_health_avg]
        X_train = np.array([
            [0.1, 5, 0.95], # Normal
            [0.2, 10, 0.90], # Normal
            [0.0, 2, 0.99], # Normal
            [0.8, 50, 0.60], # Anomaly (high error, high velocity)
            [0.9, 100, 0.40] # Anomaly
        ])
        self.clf.fit(X_train)

    def detect(self, features: list) -> float:
        """
        Returns anomaly score.
        Negative scores indicate anomalies.
        """
        try:
            # Reshape for single sample
            X = np.array(features).reshape(1, -1)
            score = self.clf.decision_function(X)[0]
            
            # Prediction: -1 is anomaly, 1 is normal
            is_anomaly = self.clf.predict(X)[0] == -1
            
            logger.info(f"Anomaly Check: Features={features}, Score={score:.3f}, IsAnomaly={is_anomaly}")
            
            return score
        except Exception as e:
            logger.error(f"Anomaly detection failed: {e}")
            return 0.0 # Return neutral score on error
