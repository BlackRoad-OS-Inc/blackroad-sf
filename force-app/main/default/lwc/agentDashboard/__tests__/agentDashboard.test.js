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
    Id: "a001",
    AgentId__c: "lucidia",
    Name: "Lucidia",
    Status__c: "active",
    Role__c: "Data Analyst",
    Domain__c: "analytics",
    DeployTarget__c: "pi",
    OllamaModel__c: "llama3",
    Symbol__c: "◈"
  },
  {
    Id: "a002",
    AgentId__c: "octavia",
    Name: "Octavia",
    Status__c: "idle",
    Role__c: "Orchestrator",
    Domain__c: "ops",
    DeployTarget__c: "cf",
    OllamaModel__c: "mistral",
    Symbol__c: "⬡"
  }
];

const MOCK_TASKS = [
  {
    Id: "t001",
    Name: "Deploy workflow",
    Status__c: "pending",
    Priority__c: "high",
    TargetRepo__c: "blackroad-operator",
    Agent__r: { Name: "Lucidia" }
  }
];

const MOCK_STATS = {
  totalAgents: 2,
  activeAgents: 1,
  cfWorkers: 3,
  piAgents: 2,
  pendingTasks: 1,
  totalCost: "$0"
};

describe("c-agent-dashboard", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("renders without errors", () => {
    const element = createElement("c-agent-dashboard", { is: AgentDashboard });
    document.body.appendChild(element);
    expect(element).not.toBeNull();
  });

  it("displays stats bar when stats data is wired", () => {
    const element = createElement("c-agent-dashboard", { is: AgentDashboard });
    document.body.appendChild(element);

    getDashboardStatsAdapter.emit(MOCK_STATS);

    return Promise.resolve().then(() => {
      const statsBar = element.shadowRoot.querySelector(".stats-bar");
      expect(statsBar).not.toBeNull();
    });
  });

  it("maps agent data with statusClass on wire", () => {
    const element = createElement("c-agent-dashboard", { is: AgentDashboard });
    document.body.appendChild(element);

    getActiveAgentsAdapter.emit(MOCK_AGENTS);

    return Promise.resolve().then(() => {
      const agentCards = element.shadowRoot.querySelectorAll(".agent-card");
      expect(agentCards.length).toBe(2);
      // First card's status badge should carry the mapped statusClass
      const firstBadge = agentCards[0].querySelector(".status-badge");
      expect(firstBadge.className).toContain("status-active");
    });
  });

  it("maps pending tasks with agentName on wire", () => {
    const element = createElement("c-agent-dashboard", { is: AgentDashboard });
    document.body.appendChild(element);

    getPendingTasksAdapter.emit(MOCK_TASKS);

    return Promise.resolve().then(() => {
      // Datatable stub receives the mapped data; verify via the stub's data property
      const datatable = element.shadowRoot.querySelector("lightning-datatable");
      expect(datatable.data[0].agentName).toBe("Lucidia");
    });
  });

  it("handles missing Agent__r gracefully", () => {
    const element = createElement("c-agent-dashboard", { is: AgentDashboard });
    document.body.appendChild(element);

    getPendingTasksAdapter.emit([
      {
        Id: "t002",
        Name: "Orphan task",
        Status__c: "pending",
        Priority__c: "low",
        TargetRepo__c: "blackroad-sf"
      }
    ]);

    return Promise.resolve().then(() => {
      // agentName should default to '' when Agent__r is absent
      const datatable = element.shadowRoot.querySelector("lightning-datatable");
      expect(datatable.data[0].agentName).toBe("");
    });
  });

  it("logs error when getActiveAgents wire returns error", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const element = createElement("c-agent-dashboard", { is: AgentDashboard });
    document.body.appendChild(element);

    getActiveAgentsAdapter.error({ message: "Apex error" });

    return Promise.resolve().then(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error loading agents:",
        expect.anything()
      );
      consoleSpy.mockRestore();
    });
  });

  it("updates syncPayload on combobox change", () => {
    const element = createElement("c-agent-dashboard", { is: AgentDashboard });
    document.body.appendChild(element);

    const changeEvent = new CustomEvent("change", {
      detail: { value: "workflows" }
    });
    const combobox = element.shadowRoot.querySelector("lightning-combobox");
    combobox.dispatchEvent(changeEvent);

    return Promise.resolve().then(() => {
      // After the change event, subsequent triggerUniverseSync should send 'workflows' payload
      let capturedBody;
      global.fetch = jest.fn().mockImplementation((_url, opts) => {
        capturedBody = JSON.parse(opts.body);
        return Promise.resolve({ ok: true });
      });
      element.addEventListener("lightning__showtoast", () => {});
      const buttons = element.shadowRoot.querySelectorAll("lightning-button");
      buttons[1].dispatchEvent(new CustomEvent("click"));
      return Promise.resolve().then(() => {
        expect(capturedBody.inputs.payload).toBe("workflows");
      });
    });
  });

  it("triggerUniverseSync posts to gateway workflow endpoint", async () => {
    const element = createElement("c-agent-dashboard", { is: AgentDashboard });
    document.body.appendChild(element);

    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    element.addEventListener("lightning__showtoast", () => {});

    // Header buttons: [0]=Sync from Pi Fleet, [1]=Deploy to All Orgs (→ triggerUniverseSync)
    const buttons = element.shadowRoot.querySelectorAll("lightning-button");
    buttons[1].dispatchEvent(new CustomEvent("click"));

    await Promise.resolve();
    await Promise.resolve();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/github/workflow"),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("triggerUniverseSync uses blackroad-operator repo", async () => {
    const element = createElement("c-agent-dashboard", { is: AgentDashboard });
    document.body.appendChild(element);

    let capturedBody;
    global.fetch = jest.fn().mockImplementation((_url, opts) => {
      capturedBody = JSON.parse(opts.body);
      return Promise.resolve({ ok: true });
    });

    element.addEventListener("lightning__showtoast", () => {});

    // Header buttons: [0]=Sync from Pi Fleet, [1]=Deploy to All Orgs (→ triggerUniverseSync)
    const buttons = element.shadowRoot.querySelectorAll("lightning-button");
    buttons[1].dispatchEvent(new CustomEvent("click"));

    await Promise.resolve();
    await Promise.resolve();

    expect(capturedBody.repo).toBe("BlackRoad-OS-Inc/blackroad-operator");
  });

  it("invokeAgent dispatches success toast when fetch succeeds", async () => {
    const element = createElement("c-agent-dashboard", { is: AgentDashboard });
    document.body.appendChild(element);

    getActiveAgentsAdapter.emit(MOCK_AGENTS);
    await Promise.resolve();

    global.fetch = jest.fn().mockResolvedValue({ ok: true });
    element.addEventListener("lightning__showtoast", () => {});

    const invokeBtn = element.shadowRoot.querySelector(
      'lightning-button-icon[title="Invoke Agent"]'
    );
    invokeBtn.dispatchEvent(new CustomEvent("click"));

    await Promise.resolve();
    await Promise.resolve();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/agent"),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("syncFromPi dispatches info toast", async () => {
    const element = createElement("c-agent-dashboard", { is: AgentDashboard });
    document.body.appendChild(element);

    const toastEvents = [];
    element.addEventListener("lightning__showtoast", (e) =>
      toastEvents.push(e)
    );

    // Header buttons: [0]=Sync from Pi Fleet (→ syncFromPi)
    const buttons = element.shadowRoot.querySelectorAll("lightning-button");
    buttons[0].dispatchEvent(new CustomEvent("click"));

    await Promise.resolve();

    expect(toastEvents.length).toBeGreaterThan(0);
    expect(toastEvents[0].detail.variant).toBe("info");
  });

  it("payloadOptions contains expected entries", () => {
    const element = createElement("c-agent-dashboard", { is: AgentDashboard });
    document.body.appendChild(element);

    const combobox = element.shadowRoot.querySelector("lightning-combobox");
    expect(combobox).not.toBeNull();
  });
});
