import "./eve2.mjs";
import "./eve.mjs";
// node_modules/eve/dist/src/execution/workflow-references.js
const STABLE_ID_BASE = "eve";
const workflowEntryReference = { workflowId: `workflow//${STABLE_ID_BASE}//workflowEntry` };
const sessionTimeoutWorkflowReference = { workflowId: `workflow//${STABLE_ID_BASE}//sessionTimeoutWorkflow` };
const workflowToolRunWorkflowReference = { workflowId: `workflow//${STABLE_ID_BASE}//workflowToolRunWorkflow` };
const connectionEventWorkflowReference = { workflowId: `workflow//${STABLE_ID_BASE}//connectionEventWorkflow` };
const connectionEventDeliveryWorkflowReference = { workflowId: `workflow//${STABLE_ID_BASE}//connectionEventDeliveryWorkflow` };
export { connectionEventDeliveryWorkflowReference, connectionEventWorkflowReference, sessionTimeoutWorkflowReference, workflowEntryReference, workflowToolRunWorkflowReference };

//# sourceMappingURL=eve72.mjs.map