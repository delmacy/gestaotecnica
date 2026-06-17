from github_helper import GitHubHelper
import json
helper = GitHubHelper()
query = """
query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    discussions(first: 5) {
      nodes {
        title
        url
      }
    }
  }
}
"""
print(json.dumps(helper.graphql(query, {"owner": "delmacy", "name": "system-builder-operations"})))
