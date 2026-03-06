import { createElement } from "lwc";
import AgentDashboard from "c/agentDashboard";
import { registerApexTestWireAdapter } from "@salesforce/sfdx-lwc-jest";
import getActiveAgents from "@salesforce/apex/AgentRegistryService.getActiveAgents";
import getPendingTasks from "@salesforce/apex/AgentRegistryService.getPendingTasks";
import getDashboardStats from "@salesforce/apex/AgentRegistryService.getDashboardStats";

const getActiveAgentsAdapter = registerApexTestWireAdapter(getActiveAgents);
const getPendingTasksAdapter = registerApexTestWireAdapter(getPendingTasks);
const getDashboardStatsAdapter = registerApexTestWireAdapter(getDashboardStats);

const MOCK_AGENTS = [
  {
    Id: "001000000000001",
    Name: "Lucidia",
    AgentId__c: "lucidia-001",
    Symbol__c: "\u25C8",
    Role__c: "Memory Keeper",
    Status__c: "active",
    Domain__c: "Memory",
    DeployTarget__c: "octavia_pi",
    OllamaModel__c: "qwen2.5:7b"
  },
  {
    Id: "001000000000002",
    Name: "Octavia",
    AgentId__c: "octavia-001",
    Symbol__c: "\u2699",
    Role__c: "Orchestrator",
    Status__c: "spawning",
    Domain__c: "Infrastructure",
    DeployTarget__c: "cloudflare_worker",
    OllamaModel__c: "qwen2.5:7b"
  }
];

const MOCK_TASKS = [
  {
    Id: "002000000000001",
    Name: "Deploy agent config",
    Agent__r: { Name: "Lucidia", Symbol__c: "\u25C8" },
    Status__c: "pending",
    Priority__c: "High",
    TargetRepo__c: "BlackRoad-OS-Inc/blackroad-operator"
  }
];

const MOCK_STATS = {
  totalAgents: 193,
  activeAgents: 42,
  cfWorkers: 12,
  piAgents: 8,
  pendingTasks: 5,
  totalCost: "$0.00"
};

// eslint-disable-next-line @lwc/lwc/no-async-operation
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("c-agent-dashboard", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.restoreAllMocks();
  });

  function createComponent() {
    const element = createElement("c-agent-dashboard", { is: AgentDashboard });
    document.body.appendChild(element);
    return element;
  }

  it("renders the component with header", () => {
    const element = createComponent();
    const header = element.shadowRoot.querySelector("h1");
    expect(header).not.toBeNull();
    expect(header.textContent).toContain("BlackRoad OS");
  });

  it("displays stats bar when wire returns data", async () => {
    const element = createComponent();

    getDashboardStatsAdapter.emit(MOCK_STATS);
    await flushPromises();

    const statsBar = element.shadowRoot.querySelector(".stats-bar");
    expect(statsBar).not.toBeNull();

    const statNumbers = element.shadowRoot.querySelectorAll(".stat-number");
    expect(statNumbers.length).toBeGreaterThan(0);
  });

  it("renders agent cards from wire data", async () => {
    const element = createComponent();

    getActiveAgentsAdapter.emit(MOCK_AGENTS);
    await flushPromises();

    const agentCards = element.shadowRoot.querySelectorAll(".agent-card");
    expect(agentCards.length).toBe(2);
  });

  it("maps status to correct statusClass on badges", async () => {
    const element = createComponent();

    getActiveAgentsAdapter.emit(MOCK_AGENTS);
    await flushPromises();

    const badges = element.shadowRoot.querySelectorAll(".status-badge");
    expect(badges.length).toBe(2);
    expect(badges[0].classList.contains("status-active")).toBe(true);
    expect(badges[1].classList.contains("status-spawning")).toBe(true);
  });

  it("handles task with missing Agent__r gracefully", async () => {
    const element = createComponent();

    const taskNoAgent = [{ ...MOCK_TASKS[0], Agent__r: undefined }];
    getPendingTasksAdapter.emit(taskNoAgent);
    await flushPromises();

    // Component should not throw — verify it still renders
    expect(element.shadowRoot.querySelector("h1")).not.toBeNull();
  });

  it("logs error when agents wire fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    createComponent();

    getActiveAgentsAdapter.error();
    await flushPromises();

    expect(consoleSpy).toHaveBeenCalled();
  });

  it("renders combobox with payload options", async () => {
    const element = createComponent();

    getDashboardStatsAdapter.emit(MOCK_STATS);
    await flushPromises();

    // Navigate to deploy tab to find combobox
    const combobox = element.shadowRoot.querySelector("lightning-combobox");
    expect(combobox).not.toBeNull();
  });

  it("triggers universe sync via Deploy button", async () => {
    const element = createComponent();
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    const buttons = element.shadowRoot.querySelectorAll("lightning-button");
    const deployBtn = Array.from(buttons).find(
      (b) => b.label === "Deploy to All Orgs"
    );
    expect(deployBtn).toBeDefined();

    deployBtn.click();
    await flushPromises();

    expect(global.fetch).toHaveBeenCalled();
    const callArgs = global.fetch.mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body.repo).toBe("BlackRoad-OS-Inc/blackroad-operator");
  });

  it("dispatches toast on Sync from Pi button click", async () => {
    const element = createComponent();
    const handler = jest.fn();
    element.addEventListener("lightning__showtoast", handler);

    const buttons = element.shadowRoot.querySelectorAll("lightning-button");
    const syncBtn = Array.from(buttons).find(
      (b) => b.label === "Sync from Pi Fleet"
    );
    expect(syncBtn).toBeDefined();

    syncBtn.click();
    await flushPromises();

    expect(handler).toHaveBeenCalled();
  });

  it("shows cost badge in header", () => {
    const element = createComponent();
    const badge = element.shadowRoot.querySelector(".cost-badge");
    expect(badge).not.toBeNull();
    expect(badge.textContent).toBe("$0/mo");
  });

  it("renders agent name and symbol", async () => {
    const element = createComponent();

    getActiveAgentsAdapter.emit(MOCK_AGENTS);
    await flushPromises();

    const names = element.shadowRoot.querySelectorAll(".agent-name");
    expect(names[0].textContent).toBe("Lucidia");
    expect(names[1].textContent).toBe("Octavia");
  });
});
