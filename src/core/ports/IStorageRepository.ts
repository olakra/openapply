import { OpenApplySettings, UserResume, UnemploymentLogEntry, JobScorecard } from '@openapply/shared-types';

/**
 * Storage repository interface contract for local and Chrome storage persistence.
 */
export interface IStorageRepository {
  getSettings(): Promise<OpenApplySettings>;
  saveSettings(settings: OpenApplySettings): Promise<void>;

  getResume(): Promise<UserResume>;
  saveResume(resume: UserResume): Promise<void>;

  getUnemploymentLogs(): Promise<UnemploymentLogEntry[]>;
  saveUnemploymentLog(entry: UnemploymentLogEntry): Promise<void>;

  getScorecards(): Promise<Record<string, JobScorecard>>;
  saveScorecard(scorecard: JobScorecard): Promise<void>;

  exportAllData(): Promise<string>;
  wipeAllData(): Promise<void>;
}
