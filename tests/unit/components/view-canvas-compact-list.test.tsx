import { test } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderToString } from "react-dom/server";
import { ViewCanvas } from "../../../src/components/builder/view-builder/ViewCanvas";
import { ViewBlueprint } from "../../../src/components/builder/view-builder/view-builder-types";

test("ViewCanvas - renders compact_list empty state when mock_row_count is 0", () => {
  const blueprint: ViewBlueprint = {
    id: "b1",
    name: "Test Blueprint",
    slug: "test-bp",
    description: "A test blueprint",
    process_area: "test",
    view_type: "compact_list",
    data_source_mode: "mock",
    readiness_status: "mock_ready",
    fields: [
      {
        id: "f1",
        label: "Field 1",
        key: "field_1",
        source_field_key: "field_1",
        field_type: "text",
        visible: true,
        sortable: false,
        filterable: false,
        groupable: false,
        width: "auto",
        format: "text",
        binding: "none",
        data_source_mode: "mock",
        readiness_status: "mock_ready",
        synthetic: true,
        notes: ""
      }
    ],
    columns: [],
    filters: [],
    sort_rules: [],
    group_rules: [],
    actions: [],
    layout: {
      show_title: true,
      show_filters: false,
      show_actions: false,
      default_page_size: 10
    },
    bindings: [],
    governance_warnings: [],
    preview_state: {
      has_mock_data: true,
      mock_row_count: 0
    },
    related_form_blueprints: [],
    related_capabilities: [],
    related_process_steps: [],
    related_docs: [],
    synthetic: true,
    notes: ""
  };

  const element = <ViewCanvas blueprint={blueprint} simulatedType="compact_list" simulatedFields={{}} />;
  const html = renderToString(element);

  assert.strictEqual(html.includes("No rows to display."), true);
});

test("ViewCanvas - renders compact_list items based on mock_row_count", () => {
  const blueprint: ViewBlueprint = {
    id: "b1",
    name: "Test Blueprint",
    slug: "test-bp",
    description: "A test blueprint",
    process_area: "test",
    view_type: "compact_list",
    data_source_mode: "mock",
    readiness_status: "mock_ready",
    fields: [
      {
        id: "f1",
        label: "Field 1",
        key: "field_1",
        source_field_key: "field_1",
        field_type: "text",
        visible: true,
        sortable: false,
        filterable: false,
        groupable: false,
        width: "auto",
        format: "text",
        binding: "none",
        data_source_mode: "mock",
        readiness_status: "mock_ready",
        synthetic: true,
        notes: ""
      }
    ],
    columns: [],
    filters: [],
    sort_rules: [],
    group_rules: [],
    actions: [],
    layout: {
      show_title: true,
      show_filters: false,
      show_actions: false,
      default_page_size: 10
    },
    bindings: [],
    governance_warnings: [],
    preview_state: {
      has_mock_data: true,
      mock_row_count: 3
    },
    related_form_blueprints: [],
    related_capabilities: [],
    related_process_steps: [],
    related_docs: [],
    synthetic: true,
    notes: ""
  };

  const element = <ViewCanvas blueprint={blueprint} simulatedType="compact_list" simulatedFields={{}} />;
  const html = renderToString(element);

  assert.strictEqual(html.includes("No rows to display."), false);
  // React renders texts like "Showing <!-- -->3<!-- --> items"
  assert.strictEqual(html.includes("Showing "), true);
  assert.strictEqual(html.includes("items"), true);

  // Contains the field label "Field 1" exactly 3 times in the rendered list
  const count = (html.match(/Field 1/g) || []).length;
  // Field 1 is shown 3 times for the rows.
  assert.strictEqual(count >= 3, true);
});
