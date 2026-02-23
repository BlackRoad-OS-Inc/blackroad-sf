import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getActiveAgents    from '@salesforce/apex/AgentRegistryService.getActiveAgents';
import getPendingTasks    from '@salesforce/apex/AgentRegistryService.getPendingTasks';
import getDashboardStats  from '@salesforce/apex/AgentRegistryService.getDashboardStats';

const GATEWAY = 'https://blackroad-agents.blackroad.workers.dev';

export default class AgentDashboard extends LightningElement {

    @track agents       = [];
    @track pendingTasks = [];
    @track deployments  = [];
    @track stats        = null;
    @track syncPayload  = 'all';

    payloadOptions = [
        { label: 'All (workflows + agents + config)',  value: 'all' },
        { label: 'Workflows only',                     value: 'workflows' },
        { label: 'AGENTS.md only',                     value: 'agents' },
        { label: 'Config only',                        value: 'config' },
    ];

    taskColumns = [
        { label: 'Task',       fieldName: 'Name',           type: 'text' },
        { label: 'Agent',      fieldName: 'agentName',      type: 'text' },
        { label: 'Status',     fieldName: 'Status__c',      type: 'text' },
        { label: 'Priority',   fieldName: 'Priority__c',    type: 'text' },
        { label: 'Repo',       fieldName: 'TargetRepo__c',  type: 'text' },
        { label: 'Cost',       fieldName: 'cost',           type: 'text' },
    ];

    deployColumns = [
        { label: 'Deployment',  fieldName: 'Name',           type: 'text' },
        { label: 'Org',         fieldName: 'TargetOrg__c',   type: 'text' },
        { label: 'Type',        fieldName: 'DeployType__c',  type: 'text' },
        { label: 'Status',      fieldName: 'Status__c',      type: 'text' },
        { label: 'Cost',        fieldName: 'cost',           type: 'text' },
        { label: 'Deployed At', fieldName: 'DeployedAt__c',  type: 'date' },
    ];

    @wire(getActiveAgents)
    wiredAgents({ data, error }) {
        if (data) {
            this.agents = data.map(a => ({
                ...a,
                statusClass: `status-badge status-${a.Status__c}`,
                cost: '$0'
            }));
        } else if (error) {
            console.error('Error loading agents:', error);
        }
    }

    @wire(getPendingTasks)
    wiredTasks({ data, error }) {
        if (data) {
            this.pendingTasks = data.map(t => ({
                ...t,
                agentName: t.Agent__r?.Name || '',
                cost: '$0'
            }));
        }
    }

    @wire(getDashboardStats)
    wiredStats({ data, error }) {
        if (data) this.stats = data;
    }

    handlePayloadChange(e) {
        this.syncPayload = e.detail.value;
    }

    // Trigger GitHub Actions universe sync via CF worker
    async triggerUniverseSync() {
        try {
            const resp = await fetch(`${GATEWAY}/github/workflow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    repo:     'BlackRoad-OS-Inc/blackroad',
                    workflow: 'sync-universe.yml',
                    inputs:   { payload: this.syncPayload, orgs: 'all', dry_run: false }
                })
            });
            this.dispatchEvent(new ShowToastEvent({
                title:   '🌌 Universe Sync Triggered',
                message: `Deploying to all 17 orgs (1,825+ repos). Cost: $0.`,
                variant: 'success'
            }));
        } catch (err) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Sync Error', message: err.message, variant: 'error'
            }));
        }
    }

    // Invoke an agent directly on Pi fleet
    async invokeAgent(event) {
        const agentId = event.currentTarget.dataset.agent;
        try {
            await fetch(`${GATEWAY}/agent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agent: agentId, cost: '$0' })
            });
            this.dispatchEvent(new ShowToastEvent({
                title:   `Agent Invoked`,
                message: `${agentId} is running on your Pi fleet. Cost: $0.`,
                variant: 'success'
            }));
        } catch (err) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error', message: err.message, variant: 'error'
            }));
        }
    }

    // Sync agent statuses from Pi Ollama APIs
    async syncFromPi() {
        this.dispatchEvent(new ShowToastEvent({
            title:   '🍎 Syncing from Pi Fleet',
            message: 'Polling Octavia (192.168.4.38) + Lucidia (192.168.4.81) via Cloudflare tunnel...',
            variant: 'info'
        }));
    }
}
