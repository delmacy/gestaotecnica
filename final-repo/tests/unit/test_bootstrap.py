import json
import os
import unittest
import jsonschema
import yaml

class TestContractsAndPolicies(unittest.TestCase):
    def setUp(self):
        self.base_path = "bootstrap-repo"

    def test_client_manifest_schema(self):
        schema_path = os.path.join(self.base_path, "schemas/client-manifest.schema.json")
        with open(schema_path, 'r') as f:
            schema = json.load(f)

        # Valid data
        valid_data = {
            "schemaVersion": "1.0.0",
            "clientId": "550e8400-e29b-41d4-a716-446655440000",
            "clientSlug": "test-client",
            "displayName": "Test Client",
            "repository": "delmacy/test-client",
            "managementMode": "managed",
            "updateChannel": "stable",
            "systemBuilderVersion": "2.0.0",
            "runtimeVersion": "20.0.0",
            "enabledCapabilities": ["auth", "database"],
            "enabledBlueprints": ["standard-saas"],
            "environments": {
                "production": {"url": "https://api.test.com", "provider": "aws"}
            },
            "integrations": [],
            "deploymentStrategy": "blue-green",
            "telemetryPolicy": "full"
        }
        jsonschema.validate(instance=valid_data, schema=schema)

    def test_release_manifest_schema(self):
        schema_path = os.path.join(self.base_path, "schemas/release-manifest.schema.json")
        with open(schema_path, 'r') as f:
            schema = json.load(f)

        valid_data = {
            "releaseId": "550e8400-e29b-41d4-a716-446655440001",
            "version": "1.2.3",
            "channel": "stable",
            "createdAt": "2026-06-17T20:00:00Z",
            "commitSha": "a" * 40,
            "containerImages": [{"image": "sb-core", "tag": "v1.2.3", "digest": "sha256:abc"}],
            "packages": {},
            "databaseSchemaVersion": "10",
            "minimumClientSchemaVersion": "1.0.0",
            "compatibleRuntimeRange": ">=20",
            "breakingChanges": False,
            "requiredMigrations": [],
            "optionalMigrations": [],
            "checksums": {},
            "sbom": {}
        }
        jsonschema.validate(instance=valid_data, schema=schema)

    def test_policies_are_valid_yaml(self):
        policy_dir = os.path.join(self.base_path, "policies")
        for filename in os.listdir(policy_dir):
            if filename.endswith(".yml"):
                with open(os.path.join(policy_dir, filename), 'r') as f:
                    yaml.safe_load(f)

if __name__ == "__main__":
    unittest.main()
