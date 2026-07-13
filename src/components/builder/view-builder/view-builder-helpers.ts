import { StaticViewModel, ViewBlueprint } from "./view-builder-types";
import { VIEW_BUILDER_SAMPLE_ROWS } from "./view-builder-sample-fixtures";

export function generateStaticViewModel(blueprint: ViewBlueprint): StaticViewModel {
  return {
    fields: blueprint.fields || [],
    layout: blueprint.layout || {
      show_title: false,
      show_filters: false,
      show_actions: false,
      default_page_size: 10
    },
    sample_rows: VIEW_BUILDER_SAMPLE_ROWS,
    display_metadata: {
      viewType: blueprint.view_type,
      readiness: blueprint.readiness_status
    }
  };
}
