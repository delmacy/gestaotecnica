const fs = require('fs');

let content = fs.readFileSync('tests/unit/candidate-publisher.test.ts', 'utf8');

// Replace InvalidProposedDefinitionError assert.rejects
content = content.replace(
  /await assert.rejects\([\s]*\(\) => publishApprovedCandidate\(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo\),[\s]*\(err: any\) => err instanceof InvalidProposedDefinitionError[\s]*\);/g,
  `try {
    await publishApprovedCandidate(dummyDb, validWorkspaceId, validCandidateId, validPublisherId, repo);
    assert.fail("Should have thrown InvalidProposedDefinitionError");
  } catch (err: any) {
    if (err.name === 'AssertionError') throw err;
    assert.equal(err.name, "InvalidProposedDefinitionError");
  }`
);

// Replace CandidateAlreadyPublishedError assert.rejects
content = content.replace(
  /await assert.rejects\([\s]*promise2,[\s]*\(err: any\) => err instanceof CandidateAlreadyPublishedError[\s]*\);/g,
  `try {
    await promise2;
    assert.fail("Should have thrown CandidateAlreadyPublishedError");
  } catch (err: any) {
    if (err.name === 'AssertionError') throw err;
    assert.equal(err.name, "CandidateAlreadyPublishedError");
  }`
);


fs.writeFileSync('tests/unit/candidate-publisher.test.ts', content, 'utf8');
