import { UnemploymentLogEntry } from '@openapply/shared-types';

export function generateProofConfirmationCode(jobId: string, company: string): string {
  const cleanId = jobId.replace(/\D/g, '').slice(0, 6) || '928102';
  const prefix = company.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3) || 'APP';
  const timeHex = Math.floor(Date.now() / 1000).toString(16).toUpperCase();
  return `OA-${prefix}-${cleanId}-${timeHex}`;
}

export function exportLogsToCsv(logs: UnemploymentLogEntry[]): void {
  if (logs.length === 0) return;

  const headers = [
    'Date Applied',
    'Company Name',
    'Job Title',
    'Work Location/Type',
    'Application Method / URL',
    'Confirmation Proof Hash',
    'Application Status',
    'Notes / State Audit Proof'
  ];

  const rows = logs.map(log => [
    `"${log.dateApplied}"`,
    `"${log.company.replace(/"/g, '""')}"`,
    `"${log.jobTitle.replace(/"/g, '""')}"`,
    `"${log.location} (${log.workType})"`,
    `"${log.jobUrl}"`,
    `"${log.confirmationNumber}"`,
    `"${log.status}"`,
    `"${(log.notes || 'Logged via OpenApply MV3 Browser Extension').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `openapply_unemployment_job_search_log_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
