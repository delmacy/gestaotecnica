import { BlueprintPackageManifest } from '../../../../src/platform/blueprints/contracts/blueprint-package-manifest';

export const VALID_MANIFEST_FULL: BlueprintPackageManifest = {
  packageId: 'com.example.package',
  version: '1.0.0',
  dependencies: [
    { packageId: 'com.example.core', version: '1.2.3' }
  ],
  capabilities: ['auth', 'billing'],
  forms: ['form-1', 'form-2'],
  views: ['view-1'],
  workflows: ['wf-1'],
  policies: ['policy-1'],
  seedMetadata: { key: 'value' }
};

export const VALID_MANIFEST_MINIMAL: BlueprintPackageManifest = {
  packageId: 'com.example.minimal',
  version: '0.1.0'
};

export const VALID_MANIFEST_MISSING_SECTION: BlueprintPackageManifest = {
  packageId: 'com.example.package',
  version: '1.0.0'
};

export const INVALID_MANIFEST_INCOMPATIBLE_VERSION: unknown = {
  packageId: 'com.example.package',
  version: 123
};

export const INVALID_MANIFEST_MISSING_ID: unknown = {
  version: '1.0.0'
};

export const INVALID_MANIFEST_EMPTY_VERSION: unknown = {
  packageId: 'com.example.package',
  version: ''
};

export const INVALID_MANIFEST_MISSING_DEPENDENCY_ID: unknown = {
  packageId: 'com.example.package',
  version: '1.0.0',
  dependencies: [
    { version: '1.2.3' }
  ]
};

export const INVALID_MANIFEST_EMPTY_DEPENDENCY_ID: unknown = {
  packageId: 'com.example.package',
  version: '1.0.0',
  dependencies: [
    { packageId: '', version: '1.2.3' }
  ]
};

export const INVALID_MANIFEST_MISSING_DEPENDENCY_VERSION: unknown = {
  packageId: 'com.example.package',
  version: '1.0.0',
  dependencies: [
    { packageId: 'com.example.core' }
  ]
};

export const INVALID_MANIFEST_EMPTY_DEPENDENCY_VERSION: unknown = {
  packageId: 'com.example.package',
  version: '1.0.0',
  dependencies: [
    { packageId: 'com.example.core', version: '' }
  ]
};

export const INVALID_MANIFEST_CONTAINS_SECRETS: unknown = {
  packageId: 'com.example.package',
  version: '1.0.0',
  seedMetadata: {
    connectionString: "postgres://dummy",
    password: "123"
  }
};
