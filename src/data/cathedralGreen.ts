// =============================================================================
// HomeBase Knowledge Graph — Yr Hen Dy, 5 Cathedral Green, Llandaff
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ObligationStatus = 'overdue' | 'due_soon' | 'in_progress' | 'complete' | 'not_started';
export type ActionStatus = 'pending' | 'in_progress' | 'complete';
export type IssueSeverity = 'high' | 'medium' | 'low';
export type IssueStatus = 'active' | 'resolved' | 'open';
export type WorkPhase = 'phase_1_immediate' | 'phase_2_main_contract' | 'phase_3_future';
export type WorkCategory = 'routine' | 'cyclical' | 'planned' | 'emergency';
export type DocumentType =
  | 'lease'
  | 'survey'
  | 'insurance'
  | 'policy'
  | 'minutes'
  | 'notice'
  | 'financial'
  | 'correspondence'
  | 'certificate'
  | 'quote';

export interface Building {
  id: string;
  name: string;
  nameEnglish: string;
  address: string;
  yearBuilt: number;
  storeys: number;
  listedGrade: 'II';
  conservationArea: boolean;
  constructionType: string;
  titleNumber: string;
  companyNumber: string;
  companyName: string;
  buildingValue: number;
  numberOfFlats: number;
  heating: string;
  uprn: string;
}

export interface Unit {
  id: string;
  flatNumber: number;
  floor: string;
  leaseholder: { name: string; email: string };
  secondLeaseholder?: { name: string; email: string };
  isDirector: boolean;
  isOccupier: boolean;
  tenant?: { name: string; managedBy?: string; managedByEmail?: string; tenancyLength?: string };
  leaseDate?: string;
  leaseTerm?: string;
  titleNumber?: string;
  originalLessor?: string;
  originalPrice?: number;
  notes?: string;
}

export interface ComplianceObligation {
  id: string;
  title: string;
  source: string;
  legalBasis: string;
  status: ObligationStatus;
  dueDate?: string;
  responsibleParty: string;
  description: string;
  derivationChain: string[];
}

export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  date: string;
  authorOrSource: string;
  version?: string;
  linkedObligationIds: string[];
  summary: string;
}

export interface Resolution {
  id: string;
  code: string;
  title: string;
  description: string;
  result: 'passed';
  votesInFavour: number;
  notes?: string;
  linkedActionIds: string[];
  linkedObligationIds: string[];
}

export interface Action {
  id: string;
  code: string;
  description: string;
  owner: string;
  status: ActionStatus;
  linkedResolutionId?: string;
}

export interface ServiceChargeHistoryEntry {
  period: string;
  amountPerFlat: number;
  frequency: 'monthly';
}

export interface BankAccount {
  name: string;
  sortCode: string;
  accountNumber: string;
}

export interface Scenario {
  id: number;
  name: string;
  serviceCharge: number;
  yearlyIncome: number;
  yearlyExpenses: number;
  fiveYearClosing: number;
  capitalLevy: number;
  totalWorksEstimate?: number;
}

export interface OperatingExpenses {
  buildingsInsurance: number;
  doInsurance: number;
  accountancy: number;
  gardening: number;
  adminFiling: number;
  contingency: number;
  total: number;
  inflationRate: number;
}

export interface ExpenditureThreshold {
  maxAmount: number;
  approval: string;
}

export interface FinancialData {
  serviceChargeHistory: ServiceChargeHistoryEntry[];
  openingCash: number;
  bankAccount: BankAccount;
  scenarios: Scenario[];
  operatingExpenses: OperatingExpenses;
  expenditureThresholds: ExpenditureThreshold[];
}

export interface IssueTimelineEvent {
  date: string;
  event: string;
}

export interface Issue {
  id: string;
  title: string;
  status: IssueStatus;
  severity: IssueSeverity;
  description: string;
  flatAffected?: number;
  timeline: IssueTimelineEvent[];
  linkedObligationIds: string[];
  linkedResolutionIds: string[];
  linkedDocumentIds: string[];
}

export interface WorkItem {
  id: string;
  title: string;
  phase: WorkPhase;
  category: WorkCategory;
  estimatedCost?: string;
  status: ActionStatus;
  dependencies: string[];
  contractor?: string;
  section20Required: boolean;
}

export interface Party {
  id: string;
  name: string;
  role: string;
  contact: string;
  notes?: string;
}

export interface AssistantQA {
  question: string;
  answer: string;
  derivationChain: string[];
  confidence: 'deterministic';
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  legalReference?: string;
  status: 'complete' | 'current' | 'upcoming' | 'blocked';
  completedDate?: string;
  notes?: string;
  warningText?: string;
}

export interface ComplianceWorkflow {
  id: string;
  title: string;
  description: string;
  legalBasis: string;
  category: 'consultation' | 'safety' | 'company' | 'insurance' | 'financial';
  steps: WorkflowStep[];
  linkedObligationIds: string[];
  linkedResolutionIds: string[];
}

export interface WorkProject {
  id: string;
  workItemId: string;
  title: string;
  description: string;
  status: 'not_started' | 'planning' | 'procurement' | 'in_progress' | 'complete';
  stages: WorkProjectStage[];
  budget?: string;
  actualCost?: string;
  contractor?: string;
  linkedMessages: string[];
}

export interface WorkProjectStage {
  id: string;
  title: string;
  status: 'complete' | 'current' | 'upcoming' | 'blocked' | 'not_required';
  completedDate?: string;
  notes?: string;
}

export interface Message {
  id: string;
  author: string;
  authorFlat: number;
  date: string;
  content: string;
  threadId?: string;
  threadType: 'issue' | 'action' | 'resolution' | 'general';
  threadTitle: string;
}

export interface Notification {
  id: string;
  type: 'compliance_deadline' | 'action_assigned' | 'message' | 'payment' | 'resolution';
  title: string;
  description: string;
  date: string;
  read: boolean;
  linkTo: string;
}

export interface ContractorQuote {
  id: string;
  contractorName: string;
  contactEmail: string;
  amount: number;
  vatAmount: number;
  totalInclVat: number;
  validUntil: string;
  scope: string;
  isConnectedToDirector: boolean;
  heritageCertified: boolean;
  asbestosLicensed?: boolean;
  submittedDate: string;
  notes?: string;
}

export interface QuoteRequest {
  id: string;
  title: string;
  description: string;
  buildingContext: string;
  specialRequirements: string[];
  estimatedBudget?: string;
  status: 'draft' | 'published' | 'quotes_received' | 'awarded' | 'complete';
  section20Required: boolean;
  section20Status?: string;
  linkedWorkItemId?: string;
  publishedDate?: string;
  closingDate?: string;
  quotes: ContractorQuote[];
}

export interface HelpLink {
  id: string;
  title: string;
  description: string;
  url: string;
  source: 'LEASE' | 'Gov.uk' | 'Cadw' | 'Companies House' | 'other';
  relevantTo: string[];
}

export interface BuildingLogEntry {
  id: string;
  date: string;
  type: 'issue_reported' | 'issue_updated' | 'work_completed' | 'inspection' | 'meeting' | 'financial' | 'correspondence' | 'decision';
  title: string;
  description: string;
  reportedBy?: string;
  linkedIssueId?: string;
  linkedResolutionId?: string;
  linkedDocumentId?: string;
}

export interface KnowledgeGraph {
  building: Building;
  units: Unit[];
  obligations: ComplianceObligation[];
  documents: Document[];
  resolutions: Resolution[];
  actions: Action[];
  financials: FinancialData;
  issues: Issue[];
  worksProgramme: WorkItem[];
  parties: Party[];
  assistantQA: AssistantQA[];
  messages: Message[];
  notifications: Notification[];
  workflows: ComplianceWorkflow[];
  workProjects: WorkProject[];
  quoteRequests: QuoteRequest[];
  helpLinks: HelpLink[];
  buildingLog: BuildingLogEntry[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const building: Building = {
  id: 'BLD_001',
  name: 'Yr Hen Dy',
  nameEnglish: 'The Old House',
  address: '5 Cathedral Green, Llandaff, Cardiff, CF5 2EB',
  yearBuilt: 1790,
  storeys: 3,
  listedGrade: 'II',
  conservationArea: true,
  constructionType: 'Stone/brick with slate roof and timber floors',
  titleNumber: 'WA 260685',
  companyNumber: '04827361',
  companyName: 'Cathedral Green Management Company Limited',
  buildingValue: 1800000,
  numberOfFlats: 5,
  heating: 'Gas (individual boilers per flat)',
  uprn: 'PLACEHOLDER',
};

// ---------------------------------------------------------------------------
// Units
// ---------------------------------------------------------------------------

export const units: Unit[] = [
  {
    id: 'UNIT_001',
    flatNumber: 1,
    floor: 'Ground',
    leaseholder: { name: 'Ian Clark', email: 'ianfclark88@gmail.com' },
    isDirector: true,
    isOccupier: false,
    notes: 'Listed for sale via Hern & Crabtree. No response to meeting invitations.',
  },
  {
    id: 'UNIT_002',
    flatNumber: 2,
    floor: 'Ground',
    leaseholder: { name: 'Jennifer Ann Davies (Ann)', email: 'rrobcat007@aol.com' },
    isDirector: true,
    isOccupier: true,
    notes: 'Company Secretary and Chair.',
  },
  {
    id: 'UNIT_003',
    flatNumber: 3,
    floor: 'First',
    leaseholder: { name: 'Gareth Barnes', email: 'garethbarnes15@hotmail.com' },
    isDirector: true,
    isOccupier: true,
    notes: 'Lives with partner Abbie. May sell within a year.',
  },
  {
    id: 'UNIT_004',
    flatNumber: 4,
    floor: 'First',
    leaseholder: { name: 'Janet Hicks', email: 'jmhicksviolin18@virginmedia.com' },
    isDirector: true,
    isOccupier: false,
    tenant: {
      name: 'Rad',
      managedBy: 'Northwood Cardiff',
      managedByEmail: 'cardiff@northwooduk.com',
      tenancyLength: '~15 years',
    },
    notes: 'Managed by Northwood Cardiff (Ceri, cardiff@northwooduk.com, 02920 301141).',
  },
  {
    id: 'UNIT_005',
    flatNumber: 5,
    floor: 'Second (mansard/top)',
    leaseholder: { name: 'Daniel Mohamed', email: 'danielhayesmohamed@gmail.com' },
    secondLeaseholder: { name: 'Katharine Harper', email: 'katharine.l.harper@gmail.com' },
    isDirector: true,
    isOccupier: true,
    leaseDate: '5 May 1989',
    leaseTerm: '999 years from 24 June 1978',
    titleNumber: 'WA 260685',
    originalLessor: 'L.W. Brown',
    originalPrice: 60000,
  },
];

// ---------------------------------------------------------------------------
// Compliance Obligations
// ---------------------------------------------------------------------------

export const obligations: ComplianceObligation[] = [
  {
    id: 'OBL_001',
    title: 'Asbestos reinspection',
    source: 'Asbestos Management Survey (Aug 2017)',
    legalBasis: 'Control of Asbestos Regulations 2012, Reg 4 — Duty to manage asbestos in non-domestic premises',
    status: 'overdue',
    dueDate: '2019-08-01',
    responsibleParty: 'DM (R7)',
    description:
      'Last survey August 2017. Policy requires reinspection every 24 months. Presumed ACMs identified in roof slates (Chrysotile, non-friable). A Refurbishment & Demolition (R&D) survey is required before any roof replacement works.',
    derivationChain: [
      'SURVEY[asbestos_management_2017] → FINDING[presumed_ACMs_roof_slates]',
      'REGULATION[Control_of_Asbestos_2012_Reg4] → DUTY[manage_asbestos_non_domestic]',
      'POLICY[asbestos_reinspection_24_months] → STATUS[last_inspection=Aug_2017, overdue=true]',
      'WORKS[roof_replacement] → PREREQUISITE[R&D_survey_required]',
    ],
  },
  {
    id: 'OBL_002',
    title: 'Fire doors — Flats 4 & 5',
    source: 'Fire Risk Assessment (Dec 2025)',
    legalBasis: 'Regulatory Reform (Fire Safety) Order 2005; Fire Safety (Wales) Regulations 2021',
    status: 'in_progress',
    responsibleParty: 'NB (private arrangement)',
    description:
      'FD30 fire doors required per FRA December 2025. Total cost £967.26 via Nigel Barnes. Private arrangement between leaseholders — not company expenditure.',
    derivationChain: [
      'FRA[Dec_2025] → FINDING[fire_doors_non_compliant_Flats_4_5]',
      'REGULATION[Fire_Safety_Order_2005] → REQUIREMENT[FD30_doors]',
      'REGULATION[Fire_Safety_Wales_2021] → APPLICABLE[residential_common_parts]',
      'QUOTE[NB_£967.26] → ARRANGEMENT[private_leaseholder_cost]',
    ],
  },
  {
    id: 'OBL_003',
    title: 'Communal lighting investigation',
    source: 'Fire Risk Assessment (Dec 2025)',
    legalBasis: 'Regulatory Reform (Fire Safety) Order 2005, Art 14 — Emergency routes and exits',
    status: 'not_started',
    responsibleParty: 'DM (A9)',
    description: 'FRA follow-up action: investigate communal lighting adequacy, particularly emergency lighting in common areas.',
    derivationChain: [
      'FRA[Dec_2025] → ACTION[communal_lighting_review]',
      'REGULATION[Fire_Safety_Order_2005_Art14] → REQUIREMENT[adequate_emergency_lighting]',
      'ACTION[A9] → OWNER[DM] → STATUS[not_started]',
    ],
  },
  {
    id: 'OBL_004',
    title: 'Bat survey before roof works',
    source: 'RICS Level 3 Survey (ref 1814/BS/2024)',
    legalBasis: 'Wildlife & Countryside Act 1981, s.9; Conservation of Habitats and Species Regulations 2017',
    status: 'not_started',
    responsibleParty: 'DM',
    description:
      'Ecologist bat survey required before any roof works. Survey season restricted to April-September only. RICS survey recommended this as a prerequisite.',
    derivationChain: [
      'SURVEY[RICS_1814_BS_2024] → RECOMMENDATION[bat_survey_before_roof_works]',
      'BUILDING[listed_grade=II, roof_void_access=true] → RISK[bat_roost_potential]',
      'LEGISLATION[Wildlife_Countryside_Act_1981_s9] → OFFENCE[disturb_bat_roost]',
      'CONSTRAINT[survey_season=Apr-Sep] → SCHEDULING[must_plan_ahead]',
    ],
  },
  {
    id: 'OBL_005',
    title: 'Listed Building Consent for roof works',
    source: 'Planning (Listed Buildings and Conservation Areas) Act 1990',
    legalBasis: 'Planning (Listed Buildings and Conservation Areas) Act 1990, ss.7-8',
    status: 'not_started',
    responsibleParty: 'DM',
    description:
      'Confirmation required from Cadw and Local Planning Authority (Cardiff Council) that roof replacement with composite slates and breathable underfelt constitutes like-for-like repair or requires formal LBC application.',
    derivationChain: [
      'BUILDING[listed_grade=II] → DESIGNATION[conservation_area=true]',
      'LEGAL_INSTRUMENT[Planning_Listed_Buildings_Act_1990_ss7-8] → REQUIREMENT[LBC_for_works_affecting_character]',
      'WORKS[roof_replacement_composite_slates] → QUESTION[like_for_like_or_LBC_needed]',
      'AUTHORITY[Cadw + Cardiff_LPA] → DECISION[confirmation_required]',
    ],
  },
  {
    id: 'OBL_006',
    title: 'Section 20 consultation (roof works)',
    source: 'Landlord and Tenant Act 1985, s.20',
    legalBasis: 'LTA 1985 s.20; Service Charges (Consultation Requirements) (Wales) Regulations 2004 (SI 2004/684)',
    status: 'not_started',
    responsibleParty: 'DM',
    description:
      'Notice of Intention authorised (R3). Two mandatory 30-day consultation periods before qualifying works exceeding £250 per leaseholder. Must obtain minimum 2 quotes including one from an unconnected contractor.',
    derivationChain: [
      'WORKS[roof_replacement_est>£250_per_leaseholder] → TRIGGER[section_20_consultation]',
      'LEGISLATION[LTA_1985_s20] → PROCESS[two_30_day_periods]',
      'REGULATION[SI_2004/684_Wales] → REQUIREMENT[unconnected_contractor_quote]',
      'RESOLUTION[R3] → AUTHORISATION[Notice_of_Intention]',
    ],
  },
  {
    id: 'OBL_007',
    title: 'Service charge demands — statutory requirements',
    source: 'Service Charge Demands (20 Mar 2026)',
    legalBasis: 'LTA 1985, s.21B; Service Charges (Summary of Rights and Obligations) (England) Regulations 2007 (SI 2007/3160)',
    status: 'complete',
    responsibleParty: 'DM',
    description:
      'Service charge demands issued 20 March 2026. £125/month from 1 April 2026. Bilingual Summary of Rights and Obligations attached as required by SI 2007/3160.',
    derivationChain: [
      'LEGISLATION[LTA_1985_s21B] → REQUIREMENT[summary_of_rights_with_demand]',
      'REGULATION[SI_2007/3160] → FORMAT[prescribed_summary]',
      'DOCUMENT[service_charge_demands_20_Mar_2026] → STATUS[issued_with_summary=complete]',
    ],
  },
  {
    id: 'OBL_008',
    title: 'Buildings insurance renewal',
    source: 'Allianz Insurance Schedule BB28285956',
    legalBasis: 'Lease covenant; LTA 1985, s.30A (insurance information)',
    status: 'complete',
    responsibleParty: 'DM / Ann',
    description:
      'Allianz policy BB28285956, £3,177.14/year, arranged via Thomas Carroll Brokers. Effective 12 May 2025. Covers buildings reinstatement, property owners liability, terrorism.',
    derivationChain: [
      'LEASE[covenant_insure_building] → OBLIGATION[maintain_buildings_insurance]',
      'POLICY[Allianz_BB28285956] → COVER[buildings_reinstatement + liability]',
      'BROKER[Thomas_Carroll] → RENEWAL[effective_12_May_2025]',
      'STATUS[current_and_complete]',
    ],
  },
  {
    id: 'OBL_009',
    title: 'D&O insurance renewal',
    source: 'AXA D&O Policy AC DIR 4685729',
    legalBasis: 'Best practice for company directors; Companies Act 2006, s.232-234',
    status: 'complete',
    responsibleParty: 'DM / Ann',
    description: 'AXA policy AC DIR 4685729, £202.14/year, £500,000 cover. Protects directors and officers of Cathedral Green Management Company Ltd.',
    derivationChain: [
      'COMPANY[04827361] → DIRECTORS[5_leaseholder_directors]',
      'BEST_PRACTICE[D&O_insurance_for_management_companies]',
      'POLICY[AXA_AC_DIR_4685729] → COVER[£500k] → STATUS[complete]',
    ],
  },
  {
    id: 'OBL_010',
    title: 'Companies House filings',
    source: 'Companies Act 2006',
    legalBasis: 'Companies Act 2006, ss.854-858 (confirmation statement), ss.441-453 (accounts)',
    status: 'due_soon',
    responsibleParty: 'DM / Ann / Huw Aled',
    description:
      'Annual confirmation statement and micro-entity accounts due. Company number 04827361. Accounting reference date to be confirmed with accountant Huw Aled.',
    derivationChain: [
      'COMPANY[04827361] → OBLIGATION[annual_confirmation_statement + accounts]',
      'LEGISLATION[Companies_Act_2006_ss854-858] → FILING[confirmation_statement]',
      'LEGISLATION[Companies_Act_2006_ss441-453] → FILING[annual_accounts]',
      'STATUS[due_soon]',
    ],
  },
  {
    id: 'OBL_011',
    title: 'Electrical inspection (EICR)',
    source: 'RICS Level 3 Survey (ref 1814/BS/2024); Allianz Insurance Schedule',
    legalBasis: 'Electricity at Work Regulations 1989; BS 7671 (IET Wiring Regulations)',
    status: 'overdue',
    dueDate: '2024-10-01',
    responsibleParty: 'DM / All directors',
    description:
      'No EICR on record for communal areas. Allianz schedule notes no inspection in last 5 years. RICS survey reports consumer units not recently tested. Recommended every 5 years for residential buildings.',
    derivationChain: [
      'SURVEY[RICS_1814_BS_2024] → FINDING[consumer_units_not_recently_tested]',
      'INSURANCE[Allianz_schedule] → NOTE[no_EICR_last_5_years]',
      'REGULATION[Electricity_at_Work_1989] → REQUIREMENT[safe_electrical_installation]',
      'STANDARD[BS_7671] → RECOMMENDATION[EICR_every_5_years]',
      'STATUS[overdue, no_record_of_inspection]',
    ],
  },
  {
    id: 'OBL_012',
    title: 'EPC renewals',
    source: 'Energy Performance of Buildings (England and Wales) Regulations 2012',
    legalBasis: 'Energy Performance of Buildings Regulations 2012, Reg 6',
    status: 'due_soon',
    responsibleParty: 'Individual leaseholders',
    description:
      'Energy Performance Certificates valid for 10 years. Required on sale or let. Individual leaseholder responsibility but company should maintain register.',
    derivationChain: [
      'REGULATION[Energy_Performance_Buildings_2012] → REQUIREMENT[EPC_on_sale_or_let]',
      'VALIDITY[10_years] → CHECK[per_flat_expiry_dates]',
      'RESPONSIBILITY[individual_leaseholders] → COMPANY_ROLE[maintain_register]',
    ],
  },
  {
    id: 'OBL_013',
    title: 'Gas safety — individual flats',
    source: 'RICS Level 3 Survey (ref 1814/BS/2024)',
    legalBasis: 'Gas Safety (Installation and Use) Regulations 1998; LEASE[covenant_maintain_installations]',
    status: 'not_started',
    responsibleParty: 'Individual leaseholders / landlords of rented flats',
    description:
      'Individual gas boilers per flat. Leaseholder responsibility for annual servicing. RICS survey notes boilers need regular inspection. Landlords of rented flats (Flat 4) require annual Gas Safety Certificate.',
    derivationChain: [
      'BUILDING[heating=gas_individual_boilers] → OBLIGATION[annual_gas_safety]',
      'SURVEY[RICS_1814_BS_2024] → RECOMMENDATION[regular_boiler_inspection]',
      'REGULATION[Gas_Safety_1998] → REQUIREMENT[annual_CP12_for_rented]',
      'UNIT[Flat_4_rented] → LANDLORD_OBLIGATION[annual_gas_safety_certificate]',
    ],
  },
  {
    id: 'OBL_014',
    title: 'Lead supply pipe — Flats 3-5',
    source: 'RICS Level 3 Survey (ref 1814/BS/2024)',
    legalBasis: 'Water Supply (Water Fittings) Regulations 1999; Water Supply (Water Quality) Regulations 2018 (Wales)',
    status: 'not_started',
    responsibleParty: 'DM / All directors',
    description:
      'Lead supply pipe identified by RICS survey (Sep 2024) serving Flats 3-5. Maximum permissible concentration 10 µg/l under Welsh regulations. Liaise with Dwr Cymru Welsh Water regarding replacement options.',
    derivationChain: [
      'SURVEY[RICS_1814_BS_2024] → FINDING[lead_supply_pipe_Flats_3-5]',
      'REGULATION[Water_Supply_Quality_2018_Wales] → LIMIT[lead_10_µg/l]',
      'HEALTH_RISK[lead_exposure] → ACTION[liaise_Dwr_Cymru]',
      'RESPONSIBILITY[shared_infrastructure] → PARTIES[company + water_authority]',
    ],
  },
  {
    id: 'OBL_015',
    title: 'Independent surveyor for Flat 4',
    source: 'Board Meeting Minutes (19 Mar 2026) — Resolution R4',
    legalBasis: 'Duty of care; Lease covenant for repair',
    status: 'in_progress',
    responsibleParty: 'DM (conflict declared — Flat 5 rear roof drains into Flat 4)',
    description:
      'Authorised by R4. Independent surveyor to inspect Flat 4 water ingress. Scope must address the Flat 4/5 boundary drainage issue. DM declared conflict of interest.',
    derivationChain: [
      'RESOLUTION[R4] → AUTHORISATION[independent_surveyor_Flat_4]',
      'ISSUE[Flat_4_water_ingress] → CAUSE[valley_gutter + fascia_hole]',
      'CONFLICT[DM_Flat_5_roof_drains_to_Flat_4_guttering] → DECLARED[19_Mar_2026]',
      'SCOPE[must_address_Flat_4/5_boundary_drainage]',
    ],
  },
  {
    id: 'OBL_016',
    title: 'Flat 4 interim repairs',
    source: 'Board Meeting Minutes (19 Mar 2026) — Resolution R5',
    legalBasis: 'Lease covenant for repair; duty of care to tenant',
    status: 'in_progress',
    responsibleParty: 'NB',
    description:
      'Authorised by R5. Interim repair works for Flat 4 water ingress not contingent on wider roof programme. NB inspected 18 March 2026.',
    derivationChain: [
      'RESOLUTION[R5] → AUTHORISATION[interim_repairs_Flat_4]',
      'CONDITION[not_contingent_on_roof_programme]',
      'CONTRACTOR[NB] → INSPECTION[18_Mar_2026]',
      'STATUS[in_progress]',
    ],
  },
  {
    id: 'OBL_017',
    title: 'Contractor quotes for roof works',
    source: 'Welsh SI 2004/684; Board Meeting Minutes R3',
    legalBasis: 'Service Charges (Consultation Requirements) (Wales) Regulations 2004 (SI 2004/684)',
    status: 'not_started',
    responsibleParty: 'DM',
    description:
      'Minimum 2 quotes required including one from a contractor unconnected to the management company, per Welsh consultation regulations.',
    derivationChain: [
      'REGULATION[SI_2004/684_Wales] → REQUIREMENT[min_2_quotes]',
      'REQUIREMENT[one_unconnected_contractor]',
      'EXISTING_QUOTE[Cardiff_Vale_Roofing_QT24477-2_expired]',
      'ACTION[obtain_fresh_quotes]',
    ],
  },
  {
    id: 'OBL_018',
    title: 'LPE1 disclosure policy',
    source: 'Board Meeting Minutes (19 Mar 2026) — Resolution R10',
    legalBasis: 'LPE1 (Leasehold Property Enquiries) protocol; Leasehold Reform Act considerations',
    status: 'complete',
    responsibleParty: 'All directors',
    description:
      'Standing policy adopted (R10) for handling LPE1 disclosure requests on property sales. Relevant for expected Flat 1 sale via Hern & Crabtree.',
    derivationChain: [
      'RESOLUTION[R10] → POLICY[LPE1_disclosure_standing_policy]',
      'UNIT[Flat_1_listed_for_sale] → TRIGGER[LPE1_likely_required]',
      'STATUS[policy_adopted=complete]',
    ],
  },
  {
    id: 'OBL_019',
    title: 'Fire Safety Policy adoption',
    source: 'Fire Risk Assessment (Dec 2025)',
    legalBasis: 'Regulatory Reform (Fire Safety) Order 2005; Fire Safety (Wales) Regulations 2021',
    status: 'in_progress',
    responsibleParty: 'DM',
    description: 'Draft Fire Safety Policy v1 prepared. Needs formal Board adoption. Addresses FRA recommendations.',
    derivationChain: [
      'FRA[Dec_2025] → RECOMMENDATION[formal_fire_safety_policy]',
      'DOCUMENT[Fire_Safety_Policy_DRAFT_v1] → STATUS[draft_pending_adoption]',
    ],
  },
  {
    id: 'OBL_020',
    title: 'Asbestos & Water Hygiene Policy adoption',
    source: 'Asbestos Management Survey (Aug 2017); RICS Survey (2024)',
    legalBasis: 'Control of Asbestos Regulations 2012; Water Supply Regulations',
    status: 'in_progress',
    responsibleParty: 'DM',
    description: 'Draft Asbestos & Water Hygiene Policy v1 prepared. Needs formal Board adoption.',
    derivationChain: [
      'SURVEY[asbestos_2017] + SURVEY[RICS_2024_lead_pipe] → NEED[combined_policy]',
      'DOCUMENT[Asbestos_Water_Hygiene_Policy_DRAFT_v1] → STATUS[draft_pending_adoption]',
    ],
  },
];

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export const documents: Document[] = [
  {
    id: 'DOC_001',
    title: 'Lease — Flat 1',
    type: 'lease',
    date: '',
    authorOrSource: 'Land Registry',
    linkedObligationIds: [],
    summary: 'Long lease for Flat 1, 5 Cathedral Green. Terms include service charge provisions and repairing covenants.',
  },
  {
    id: 'DOC_002',
    title: 'Lease — Flat 2',
    type: 'lease',
    date: '',
    authorOrSource: 'Land Registry',
    linkedObligationIds: [],
    summary: 'Long lease for Flat 2, 5 Cathedral Green.',
  },
  {
    id: 'DOC_003',
    title: 'Lease — Flat 3',
    type: 'lease',
    date: '',
    authorOrSource: 'Land Registry',
    linkedObligationIds: [],
    summary: 'Long lease for Flat 3, 5 Cathedral Green.',
  },
  {
    id: 'DOC_004',
    title: 'Lease — Flat 4',
    type: 'lease',
    date: '',
    authorOrSource: 'Land Registry',
    linkedObligationIds: [],
    summary: 'Long lease for Flat 4, 5 Cathedral Green.',
  },
  {
    id: 'DOC_005',
    title: 'Lease — Flat 5',
    type: 'lease',
    date: '1989-05-05',
    authorOrSource: 'Land Registry / L.W. Brown (original lessor)',
    linkedObligationIds: [],
    summary:
      'Long lease for Flat 5, dated 5 May 1989. 999 years from 24 June 1978. Original price £60,000. Lessor L.W. Brown. Title WA 260685.',
  },
  {
    id: 'DOC_006',
    title: 'RICS Level 3 Listed Building Survey',
    type: 'survey',
    date: '2024-10-02',
    authorOrSource: 'Lapider Chartered Surveyors — Adrian Gardner MRICS (ref 1814/BS/2024, surveyed 18 Sep 2024)',
    linkedObligationIds: ['OBL_004', 'OBL_011', 'OBL_013', 'OBL_014'],
    summary:
      'Comprehensive Level 3 survey of the listed building. Key findings: roof at end of life (man-made slates degrading), lead supply pipe serving Flats 3-5, consumer units not recently tested, windows mostly past repair, insulation only 100mm in roof void. Recommended bat survey before roof works.',
  },
  {
    id: 'DOC_007',
    title: 'Fire Risk Assessment',
    type: 'survey',
    date: '2025-12-01',
    authorOrSource: 'Capital Fire Protection Ltd (Nick Jones)',
    linkedObligationIds: ['OBL_002', 'OBL_003', 'OBL_019'],
    summary:
      'FRA of common parts. Key findings: fire doors needed for Flats 4 & 5 (FD30 standard), communal lighting needs review, fire safety policy required.',
  },
  {
    id: 'DOC_008',
    title: 'Asbestos Management Survey',
    type: 'survey',
    date: '2017-08-01',
    authorOrSource: 'Asbestos surveyor (details on file)',
    linkedObligationIds: ['OBL_001', 'OBL_020'],
    summary:
      'Management survey identifying presumed ACMs. Roof slates identified as Chrysotile (non-friable). Reinspection due every 24 months per policy. R&D survey required before any intrusive roof works.',
  },
  {
    id: 'DOC_009',
    title: 'Long-Term Repair and Management Plan v2.3',
    type: 'policy',
    date: '2026-03-07',
    authorOrSource: 'DM',
    version: '2.3',
    linkedObligationIds: ['OBL_001', 'OBL_004', 'OBL_005', 'OBL_006'],
    summary:
      'Comprehensive management plan covering roof strategy, compliance timeline, Section 20 process, and phased works programme. Presented to Board 19 March 2026.',
  },
  {
    id: 'DOC_010',
    title: '5-Year P&L Scenarios v2',
    type: 'financial',
    date: '2026-03-07',
    authorOrSource: 'DM',
    version: '2',
    linkedObligationIds: [],
    summary:
      'Four financial scenarios modelling service charge levels, capital levies, and works programmes over 5 years. Baseline, Pot Builder, Full Replacement, and Interim Fix.',
  },
  {
    id: 'DOC_011',
    title: 'Board Meeting Notice',
    type: 'notice',
    date: '2026-03-11',
    authorOrSource: 'DM',
    linkedObligationIds: [],
    summary:
      'Formal notice of Board meeting for 19 March 2026 at Flat 5. Agenda included roof strategy, Flat 4 issues, service charge review, and policy adoption.',
  },
  {
    id: 'DOC_012',
    title: 'Board Meeting Minutes — 19 March 2026',
    type: 'minutes',
    date: '2026-03-19',
    authorOrSource: 'DM (minute taker)',
    linkedObligationIds: ['OBL_006', 'OBL_007', 'OBL_015', 'OBL_016', 'OBL_018'],
    summary:
      'Minutes recording Resolutions R1-R10 and Actions A1-A13. All resolutions passed. Present: Ann, Gareth, DM. Apologies: Janet. Absent without apology: Ian.',
  },
  {
    id: 'DOC_013',
    title: 'Service Charge Demands — April 2026',
    type: 'financial',
    date: '2026-03-20',
    authorOrSource: 'DM',
    linkedObligationIds: ['OBL_007'],
    summary:
      'Service charge demands issued to all 5 leaseholders. £125/month from 1 April 2026. Bilingual Summary of Rights and Obligations attached.',
  },
  {
    id: 'DOC_014',
    title: 'Roof Survey & Quote — Cardiff & Vale Roofing (QT24477-2)',
    type: 'quote',
    date: '2024-08-19',
    authorOrSource: 'Cardiff & Vale Roofing Ltd (Andy)',
    linkedObligationIds: ['OBL_006', 'OBL_017'],
    summary:
      'Quote QT24477-2 for full roof replacement: remove existing man-made slates + felt/batten, install breathable underfelt + treated batten + Thrutone composite slates + code 4 lead valleys + dry-fix ridge. £23,605 + VAT. Quote expired. Additional options for chimney refurbishment (£1,850 + VAT per stack) and fascia/rainwater goods (£1,850 + VAT).',
  },
  {
    id: 'DOC_015',
    title: 'Allianz Buildings Insurance Schedule',
    type: 'insurance',
    date: '2025-05-12',
    authorOrSource: 'Allianz / Thomas Carroll Brokers',
    linkedObligationIds: ['OBL_008'],
    summary:
      'Buildings insurance policy BB28285956. £3,177.14/year. Covers buildings reinstatement, property owners liability, terrorism. Notes no EICR on record.',
  },
  {
    id: 'DOC_016',
    title: 'AXA D&O Insurance Policy',
    type: 'insurance',
    date: '2025-05-12',
    authorOrSource: 'AXA / Thomas Carroll Brokers',
    linkedObligationIds: ['OBL_009'],
    summary: 'Directors & Officers liability policy AC DIR 4685729. £202.14/year. £500,000 cover.',
  },
  {
    id: 'DOC_017',
    title: 'Thomas Carroll Broker Invoice',
    type: 'financial',
    date: '2025-05-12',
    authorOrSource: 'Thomas Carroll Brokers (ref 544347087)',
    linkedObligationIds: [],
    summary: 'Broker invoice for buildings and D&O insurance arrangement.',
  },
  {
    id: 'DOC_018',
    title: 'Fire Safety Policy (DRAFT v1)',
    type: 'policy',
    date: '2026-03-01',
    authorOrSource: 'DM',
    version: '1 (DRAFT)',
    linkedObligationIds: ['OBL_019'],
    summary: 'Draft policy addressing fire safety management for common parts. Pending formal Board adoption.',
  },
  {
    id: 'DOC_019',
    title: 'Asbestos & Water Hygiene Policy (DRAFT v1)',
    type: 'policy',
    date: '2026-03-01',
    authorOrSource: 'DM',
    version: '1 (DRAFT)',
    linkedObligationIds: ['OBL_020', 'OBL_001'],
    summary:
      'Draft policy for managing asbestos and water hygiene risks. Covers reinspection schedule, R&D survey triggers, and lead pipe management. Pending formal Board adoption.',
  },
  {
    id: 'DOC_020',
    title: 'Budget & Financial Management Policy',
    type: 'policy',
    date: '2026-03-01',
    authorOrSource: 'DM',
    linkedObligationIds: [],
    summary:
      'Policy covering expenditure thresholds, service charge setting process, and financial reporting. Includes tiered approval limits.',
  },
  {
    id: 'DOC_021',
    title: 'Maintenance & Repairs Policy',
    type: 'policy',
    date: '2026-03-01',
    authorOrSource: 'DM',
    linkedObligationIds: [],
    summary: 'Policy covering routine maintenance responsibilities, emergency repair procedures, and contractor procurement.',
  },
  {
    id: 'DOC_022',
    title: 'Articles of Association',
    type: 'policy',
    date: '2003-07-09',
    authorOrSource: 'Cathedral Green Management Company Limited',
    linkedObligationIds: [],
    summary:
      'Company Articles adopted 9 July 2003. Governs the management company including director rights, voting, and decision-making procedures.',
  },
  {
    id: 'DOC_023',
    title: 'Roof Survey — Cardiff & Vale Roofing (Aug 2024)',
    type: 'survey',
    date: '2024-08-01',
    authorOrSource: 'Cardiff & Vale Roofing Ltd (Andy)',
    linkedObligationIds: ['OBL_001', 'OBL_005'],
    summary:
      'Site survey and condition assessment of roof. Confirmed man-made slates at end of life, valley gutter issues, chimney repointing needed. Formed basis of quote QT24477-2.',
  },
  {
    id: 'DOC_024',
    title: 'Insurance Claim — Flat 4 Water Ingress (Sedgwick)',
    type: 'correspondence',
    date: '2026-02-18',
    authorOrSource: 'Sedgwick International UK (Matt Bloomfield ACII)',
    linkedObligationIds: ['OBL_015', 'OBL_016'],
    summary:
      'Claim ref 10920933, insurer ref BH/2/UN/090091. Claim denied — Sedgwick assessed damage as maintenance/wear and tear, not storm damage. Gareth challenged denial 17 Feb 2026. Sedgwick upheld denial 18 Feb 2026.',
  },
  {
    id: 'DOC_025',
    title: 'NB Inspection Report — Flat 4 (18 Mar 2026)',
    type: 'survey',
    date: '2026-03-18',
    authorOrSource: 'Nigel Barnes (NB)',
    linkedObligationIds: ['OBL_015', 'OBL_016'],
    summary:
      'NB inspected Flat 4 and roof area. Identified two water entry points: valley gutter overflow (constricted outlet to hopper head, drains 5 roof areas) and hole behind fascia at SW corner (wind-driven rain). Confirmed Flat 5 rear roof drains into Flat 4 guttering.',
  },
];

// ---------------------------------------------------------------------------
// Resolutions (R1-R10) — Board Meeting 19 March 2026
// ---------------------------------------------------------------------------

export const resolutions: Resolution[] = [
  {
    id: 'RES_001',
    code: 'R1',
    title: 'Adopt Long-Term Repair and Management Plan v2.3',
    description: 'Adopt the Long-Term Repair and Management Plan v2.3 as the guiding framework for building management.',
    result: 'passed',
    votesInFavour: 3,
    notes: 'Present: Ann, Gareth, DM. Janet sent apologies. Ian absent without apology.',
    linkedActionIds: [],
    linkedObligationIds: [],
  },
  {
    id: 'RES_002',
    code: 'R2',
    title: 'Adopt 5-Year P&L Scenarios v2',
    description: 'Adopt the 5-Year P&L Scenarios v2 as the financial planning basis.',
    result: 'passed',
    votesInFavour: 3,
    linkedActionIds: [],
    linkedObligationIds: [],
  },
  {
    id: 'RES_003',
    code: 'R3',
    title: 'Authorise Section 20 Notice of Intention',
    description: 'Authorise the issue of a Section 20 Notice of Intention for qualifying works to the roof and related structures.',
    result: 'passed',
    votesInFavour: 3,
    linkedActionIds: ['ACT_001', 'ACT_002'],
    linkedObligationIds: ['OBL_006', 'OBL_017'],
  },
  {
    id: 'RES_004',
    code: 'R4',
    title: 'Authorise independent surveyor for Flat 4',
    description:
      'Authorise appointment of an independent surveyor to assess Flat 4 water ingress. Scope must address the Flat 4/5 boundary drainage issue.',
    result: 'passed',
    votesInFavour: 3,
    notes: 'DM declared conflict of interest (Flat 5 rear roof drains into Flat 4 guttering).',
    linkedActionIds: ['ACT_003'],
    linkedObligationIds: ['OBL_015'],
  },
  {
    id: 'RES_005',
    code: 'R5',
    title: 'Authorise Flat 4 interim repairs',
    description: 'Authorise interim repair works for Flat 4 water ingress, not contingent on wider roof programme.',
    result: 'passed',
    votesInFavour: 3,
    linkedActionIds: ['ACT_004'],
    linkedObligationIds: ['OBL_016'],
  },
  {
    id: 'RES_006',
    code: 'R6',
    title: 'Increase service charge to £125/month from 1 Apr 2026',
    description: 'Increase monthly service charge from £100 to £125 per flat from 1 April 2026.',
    result: 'passed',
    votesInFavour: 3,
    linkedActionIds: ['ACT_005'],
    linkedObligationIds: ['OBL_007'],
  },
  {
    id: 'RES_007',
    code: 'R7',
    title: 'Prioritise asbestos reinspection',
    description: 'Prioritise the overdue asbestos reinspection and commission an updated management survey.',
    result: 'passed',
    votesInFavour: 3,
    linkedActionIds: ['ACT_006'],
    linkedObligationIds: ['OBL_001'],
  },
  {
    id: 'RES_008',
    code: 'R8',
    title: 'Adopt suite of management policies',
    description:
      'Adopt the following policies: Budget & Financial Management, Maintenance & Repairs, and note draft Fire Safety and Asbestos & Water Hygiene policies for further review.',
    result: 'passed',
    votesInFavour: 3,
    linkedActionIds: [],
    linkedObligationIds: ['OBL_019', 'OBL_020'],
  },
  {
    id: 'RES_009',
    code: 'R9',
    title: 'Delegate routine expenditure authority',
    description:
      'Delegate expenditure authority per the Budget & Financial Management Policy thresholds: up to £250 any one director, up to £1,000 any one director within budget, up to £5,000 two directors with written confirmation.',
    result: 'passed',
    votesInFavour: 3,
    linkedActionIds: [],
    linkedObligationIds: [],
  },
  {
    id: 'RES_010',
    code: 'R10',
    title: 'Adopt LPE1 disclosure standing policy',
    description: 'Adopt a standing policy for LPE1 disclosure responses on property sales.',
    result: 'passed',
    votesInFavour: 3,
    notes: 'Relevant for expected Flat 1 sale.',
    linkedActionIds: [],
    linkedObligationIds: ['OBL_018'],
  },
];

// ---------------------------------------------------------------------------
// Actions (A1-A13)
// ---------------------------------------------------------------------------

export const actions: Action[] = [
  {
    id: 'ACT_001',
    code: 'A1',
    description: 'Draft Section 20 Notice of Intention and circulate to Board for approval before issue.',
    owner: 'DM',
    status: 'pending',
    linkedResolutionId: 'RES_003',
  },
  {
    id: 'ACT_002',
    code: 'A2',
    description: 'Obtain minimum 2 contractor quotes including one from an unconnected contractor per Welsh SI 2004/684.',
    owner: 'DM',
    status: 'pending',
    linkedResolutionId: 'RES_003',
  },
  {
    id: 'ACT_003',
    code: 'A3',
    description: 'Appoint independent surveyor for Flat 4. Scope to address Flat 4/5 boundary drainage.',
    owner: 'DM',
    status: 'in_progress',
    linkedResolutionId: 'RES_004',
  },
  {
    id: 'ACT_004',
    code: 'A4',
    description: 'Coordinate NB interim repairs for Flat 4 water ingress.',
    owner: 'DM / NB',
    status: 'in_progress',
    linkedResolutionId: 'RES_005',
  },
  {
    id: 'ACT_005',
    code: 'A5',
    description: 'Issue service charge demands at £125/month from 1 April 2026 with Summary of Rights.',
    owner: 'DM',
    status: 'complete',
    linkedResolutionId: 'RES_006',
  },
  {
    id: 'ACT_006',
    code: 'A6',
    description: 'Commission asbestos reinspection / updated management survey.',
    owner: 'DM',
    status: 'pending',
    linkedResolutionId: 'RES_007',
  },
  {
    id: 'ACT_007',
    code: 'A7',
    description: 'Confirm with Cadw / Cardiff LPA whether roof works require formal LBC application or qualify as like-for-like repair.',
    owner: 'DM',
    status: 'pending',
  },
  {
    id: 'ACT_008',
    code: 'A8',
    description: 'Commission ecologist bat survey (April-September season only).',
    owner: 'DM',
    status: 'pending',
  },
  {
    id: 'ACT_009',
    code: 'A9',
    description: 'Investigate communal lighting adequacy and emergency lighting requirements (FRA follow-up).',
    owner: 'DM',
    status: 'pending',
  },
  {
    id: 'ACT_010',
    code: 'A10',
    description: 'Commission EICR for communal electrical installations.',
    owner: 'DM',
    status: 'pending',
  },
  {
    id: 'ACT_011',
    code: 'A11',
    description: 'Liaise with Dwr Cymru Welsh Water regarding lead supply pipe replacement for Flats 3-5.',
    owner: 'DM',
    status: 'pending',
  },
  {
    id: 'ACT_012',
    code: 'A12',
    description: 'Make informal enquiries about satellite dishes on opposite building near Flat 3 kitchen.',
    owner: 'DM',
    status: 'pending',
  },
  {
    id: 'ACT_013',
    code: 'A13',
    description: 'Prepare and file Companies House annual confirmation statement and micro-entity accounts.',
    owner: 'DM / Huw Aled',
    status: 'pending',
  },
];

// ---------------------------------------------------------------------------
// Financial Data
// ---------------------------------------------------------------------------

export const financials: FinancialData = {
  serviceChargeHistory: [
    { period: 'Before Jul 2025', amountPerFlat: 75, frequency: 'monthly' },
    { period: 'Jul 2025 – Mar 2026', amountPerFlat: 100, frequency: 'monthly' },
    { period: 'From Apr 2026', amountPerFlat: 125, frequency: 'monthly' },
  ],
  openingCash: 4242.85,
  bankAccount: {
    name: 'Lloyds Community Account',
    sortCode: '30-91-63',
    accountNumber: '00753648',
  },
  scenarios: [
    {
      id: 1,
      name: 'Baseline',
      serviceCharge: 100,
      yearlyIncome: 6000,
      yearlyExpenses: 4839.28,
      fiveYearClosing: 8550.46,
      capitalLevy: 0,
    },
    {
      id: 2,
      name: 'Pot Builder',
      serviceCharge: 125,
      yearlyIncome: 7500,
      yearlyExpenses: 4839.28,
      fiveYearClosing: 16050.46,
      capitalLevy: 0,
    },
    {
      id: 3,
      name: 'Full Replacement',
      serviceCharge: 125,
      yearlyIncome: 7500,
      yearlyExpenses: 4839.28,
      fiveYearClosing: 16050.46,
      capitalLevy: 10631,
      totalWorksEstimate: 51284,
    },
    {
      id: 4,
      name: 'Interim Fix',
      serviceCharge: 125,
      yearlyIncome: 7500,
      yearlyExpenses: 4839.28,
      fiveYearClosing: 16050.46,
      capitalLevy: 3876,
      totalWorksEstimate: 19380,
    },
  ],
  operatingExpenses: {
    buildingsInsurance: 3177.14,
    doInsurance: 202.14,
    accountancy: 460,
    gardening: 600,
    adminFiling: 100,
    contingency: 300,
    total: 4839.28,
    inflationRate: 0.03,
  },
  expenditureThresholds: [
    { maxAmount: 250, approval: 'Any one Director' },
    { maxAmount: 1000, approval: 'Any one Director (within budget)' },
    { maxAmount: 5000, approval: 'Two Directors (written confirmation)' },
    { maxAmount: Infinity, approval: 'Full Board + Section 20 if recoverable' },
  ],
};

// ---------------------------------------------------------------------------
// Issues
// ---------------------------------------------------------------------------

export const issues: Issue[] = [
  {
    id: 'ISS_001',
    title: 'Flat 4 Water Ingress',
    status: 'active',
    severity: 'high',
    description:
      'Persistent water ingress into Flat 4 from two entry points: (1) valley gutter overflow — constricted outlet to hopper head, drains 5 roof areas; (2) hole behind fascia at SW corner — wind-driven rain. Flat 5 rear roof drains into Flat 4 guttering, creating a boundary issue. DM declared conflict of interest. Tenant Rad has been living with damage for approximately 15 years; ongoing and worsening.',
    flatAffected: 4,
    timeline: [
      { date: '2011-01-01', event: 'Water damage first reported by tenant Rad (approximate)' },
      { date: '2025-12-01', event: 'Insurance claim lodged (Sedgwick ref 10920933, insurer ref BH/2/UN/090091)' },
      { date: '2026-01-15', event: 'Sedgwick denies claim — assessed as maintenance/wear and tear, not storm damage' },
      { date: '2026-02-17', event: 'Gareth challenges denial with Sedgwick' },
      { date: '2026-02-18', event: 'Sedgwick upholds denial' },
      { date: '2026-03-18', event: 'NB inspects Flat 4 and roof area, identifies two water entry points' },
      { date: '2026-03-19', event: 'Board authorises independent surveyor (R4) and interim repairs (R5)' },
    ],
    linkedObligationIds: ['OBL_015', 'OBL_016'],
    linkedResolutionIds: ['RES_004', 'RES_005'],
    linkedDocumentIds: ['DOC_024', 'DOC_025'],
  },
  {
    id: 'ISS_002',
    title: 'Flat 1 Electricity Cupboard',
    status: 'resolved',
    severity: 'medium',
    description:
      'Cover came off external electricity cupboard, exposing it to the elements and creating a fire hazard. Flagged by DM in December 2025.',
    flatAffected: 1,
    timeline: [
      { date: '2025-12-01', event: 'DM flags exposed electricity cupboard as fire hazard' },
      { date: '2026-01-15', event: 'Ian pays £150 catch-up and confirms repair completed' },
    ],
    linkedObligationIds: [],
    linkedResolutionIds: [],
    linkedDocumentIds: [],
  },
  {
    id: 'ISS_003',
    title: 'Satellite Dishes',
    status: 'open',
    severity: 'low',
    description:
      'Satellite dishes visible on opposite building near Flat 3 (Gareth) kitchen. Query whether they are in active use or can be removed.',
    timeline: [
      { date: '2026-03-19', event: 'Noted at Board meeting. DM to make informal enquiries (A12).' },
    ],
    linkedObligationIds: [],
    linkedResolutionIds: [],
    linkedDocumentIds: [],
  },
];

// ---------------------------------------------------------------------------
// Works Programme
// ---------------------------------------------------------------------------

export const worksProgramme: WorkItem[] = [
  // Phase 1 — Immediate / preparatory
  {
    id: 'WRK_001',
    title: 'Bat survey (ecologist)',
    phase: 'phase_1_immediate',
    category: 'planned',
    estimatedCost: '£500–800',
    status: 'pending',
    dependencies: ['Survey season April-September only'],
    section20Required: false,
  },
  {
    id: 'WRK_002',
    title: 'Asbestos reinspection',
    phase: 'phase_1_immediate',
    category: 'planned',
    estimatedCost: '£300–500',
    status: 'pending',
    dependencies: [],
    section20Required: false,
  },
  {
    id: 'WRK_003',
    title: 'Listed Building Consent confirmation',
    phase: 'phase_1_immediate',
    category: 'planned',
    estimatedCost: 'No cost (administrative)',
    status: 'pending',
    dependencies: ['Cadw and LPA response times'],
    section20Required: false,
  },
  {
    id: 'WRK_004',
    title: 'Contractor quotes (min 2, one unconnected)',
    phase: 'phase_1_immediate',
    category: 'planned',
    status: 'pending',
    dependencies: ['WRK_001', 'WRK_002', 'WRK_003'],
    section20Required: false,
  },
  {
    id: 'WRK_005',
    title: 'Valley gutter repair / interim works',
    phase: 'phase_1_immediate',
    category: 'emergency',
    status: 'in_progress',
    dependencies: [],
    contractor: 'Nigel Barnes (NB)',
    section20Required: false,
  },
  {
    id: 'WRK_006',
    title: 'Chimney repairs — north elevation',
    phase: 'phase_1_immediate',
    category: 'planned',
    status: 'pending',
    dependencies: [],
    contractor: 'Nigel Barnes (NB)',
    section20Required: false,
  },
  {
    id: 'WRK_007',
    title: 'Fascia replacement — north elevation',
    phase: 'phase_1_immediate',
    category: 'planned',
    status: 'pending',
    dependencies: ['WRK_006'],
    contractor: 'Nigel Barnes (NB)',
    section20Required: false,
  },
  {
    id: 'WRK_008',
    title: 'Hole behind fascia — SW corner Flat 4',
    phase: 'phase_1_immediate',
    category: 'emergency',
    status: 'in_progress',
    dependencies: [],
    contractor: 'Nigel Barnes (NB)',
    section20Required: false,
  },
  {
    id: 'WRK_009',
    title: 'Fire doors — Flats 4 & 5',
    phase: 'phase_1_immediate',
    category: 'planned',
    estimatedCost: '£967.26',
    status: 'in_progress',
    dependencies: [],
    contractor: 'Nigel Barnes (NB)',
    section20Required: false,
  },
  {
    id: 'WRK_010',
    title: 'Communal lighting investigation',
    phase: 'phase_1_immediate',
    category: 'planned',
    status: 'pending',
    dependencies: [],
    section20Required: false,
  },
  // Phase 2 — Main contract (post Section 20)
  {
    id: 'WRK_011',
    title: 'Full roof replacement',
    phase: 'phase_2_main_contract',
    category: 'planned',
    estimatedCost: '£23,605 + VAT',
    status: 'pending',
    dependencies: ['WRK_001', 'WRK_002', 'WRK_003', 'WRK_004', 'Section 20 consultation complete'],
    contractor: 'Cardiff & Vale Roofing Ltd',
    section20Required: true,
  },
  {
    id: 'WRK_012',
    title: 'Interim roof fix (alternative to full replacement)',
    phase: 'phase_2_main_contract',
    category: 'planned',
    estimatedCost: '~£19,380 total (£3,876/flat levy)',
    status: 'pending',
    dependencies: ['WRK_001', 'WRK_002', 'WRK_003'],
    section20Required: true,
  },
  {
    id: 'WRK_013',
    title: 'Chimney refurbishment — repoint, new flaunching, pepper pot caps',
    phase: 'phase_2_main_contract',
    category: 'planned',
    estimatedCost: '£1,850 + VAT per stack',
    status: 'pending',
    dependencies: ['Optional with WRK_011'],
    contractor: 'Cardiff & Vale Roofing Ltd',
    section20Required: true,
  },
  {
    id: 'WRK_014',
    title: 'Fascia & rainwater goods — aluminium gutters/hoppers/downpipes, timber fascia/soffits/bargeboards',
    phase: 'phase_2_main_contract',
    category: 'planned',
    estimatedCost: '£1,850 + VAT',
    status: 'pending',
    dependencies: ['Optional with WRK_011'],
    contractor: 'Cardiff & Vale Roofing Ltd',
    section20Required: true,
  },
  // Phase 3 — Future
  {
    id: 'WRK_015',
    title: 'Window repairs/replacement',
    phase: 'phase_3_future',
    category: 'planned',
    status: 'pending',
    dependencies: ['LBC required', 'Most windows past repair per RICS survey'],
    section20Required: true,
  },
  {
    id: 'WRK_016',
    title: 'External redecoration (walls, stone cills)',
    phase: 'phase_3_future',
    category: 'cyclical',
    status: 'pending',
    dependencies: [],
    section20Required: false,
  },
  {
    id: 'WRK_017',
    title: 'Lead pipe replacement — Flats 3-5',
    phase: 'phase_3_future',
    category: 'planned',
    status: 'pending',
    dependencies: ['Dwr Cymru liaison'],
    section20Required: false,
  },
  {
    id: 'WRK_018',
    title: 'Insulation upgrade — roof void (currently only 100mm)',
    phase: 'phase_3_future',
    category: 'planned',
    status: 'pending',
    dependencies: ['WRK_011 or WRK_012 completed first'],
    section20Required: false,
  },
];

// ---------------------------------------------------------------------------
// Parties / Contractors
// ---------------------------------------------------------------------------

export const parties: Party[] = [
  {
    id: 'PTY_001',
    name: 'Cardiff & Vale Roofing Ltd',
    role: 'Roofing contractor',
    contact: 'Andy — andy@cardiffandvaleroofing.co.uk, 02922 522032',
    notes: 'The Embassy, 389 Newport Rd, Cardiff CF24 1TP. Co. 14196607. Provided quote QT24477-2 (expired).',
  },
  {
    id: 'PTY_002',
    name: 'Capital Fire Protection Ltd',
    role: 'Fire Risk Assessment provider',
    contact: 'Nick Jones — capital.nj@me.com',
  },
  {
    id: 'PTY_003',
    name: 'Nigel Barnes (NB)',
    role: 'Builder / handyman',
    contact: 'Via Gareth Barnes (son)',
    notes:
      'Father of Gareth (Flat 3 leaseholder). Handling fire doors, roof inspection, interim Flat 4 repairs, chimney works, fascia replacement.',
  },
  {
    id: 'PTY_004',
    name: 'Lapider Chartered Surveyors',
    role: 'RICS surveyor',
    contact: 'Adrian Gardner MRICS — a.gardner@lapider.co.uk, 029 2070 6242',
    notes: '41 High Street, Penarth CF64 1EY. RICS No. 1114836. Conducted Level 3 Listed Building Survey ref 1814/BS/2024.',
  },
  {
    id: 'PTY_005',
    name: 'Thomas Carroll Brokers',
    role: 'Insurance broker',
    contact: 'Sam / Lucy Davies — lucy.davies@thomas-carroll.co.uk, 02920 858608',
    notes: 'Arranges buildings insurance (Allianz) and D&O insurance (AXA).',
  },
  {
    id: 'PTY_006',
    name: 'Sedgwick International UK',
    role: 'Loss adjuster',
    contact: 'Matt Bloomfield ACII — matt.bloomfield@uk.sedgwick.com, +44 7920 500253',
    notes: 'Claim ref 10920933. Denied Flat 4 water ingress claim (maintenance/wear, not storm).',
  },
  {
    id: 'PTY_007',
    name: 'Northwood Cardiff',
    role: 'Letting agent (Flat 4)',
    contact: 'Ceri — cardiff@northwooduk.com, 02920 301141',
    notes: 'Manages letting of Flat 4 for Janet Hicks.',
  },
  {
    id: 'PTY_008',
    name: 'Huw Aled',
    role: 'Accountant',
    contact: 'Details on file',
    notes: 'Handles company accounts and Companies House filings.',
  },
  {
    id: 'PTY_009',
    name: 'Hern & Crabtree',
    role: 'Estate agent',
    contact: 'Details on file',
    notes: 'Handling sale of Flat 1 for Ian Clark.',
  },
];

// ---------------------------------------------------------------------------
// Assistant Q&A
// ---------------------------------------------------------------------------

export const assistantQA: AssistantQA[] = [
  {
    question: 'Do we need Listed Building Consent for the roof works?',
    answer:
      'Yes, confirmation is required. The building is Grade II listed and within a Conservation Area. Under the Planning (Listed Buildings and Conservation Areas) Act 1990, sections 7-8, any works affecting the character of a listed building require LBC. The proposed works involve replacing man-made slates with Thrutone composite slates and installing breathable underfelt — this needs confirmation from Cadw and Cardiff LPA whether it qualifies as like-for-like repair or requires a formal LBC application. This is Action A7, currently pending.',
    derivationChain: [
      'BUILDING[id=BLD_001] → listed_grade=II, conservation_area=true',
      'LEGISLATION[Planning_Listed_Buildings_Act_1990] → ss.7-8 → REQUIREMENT[LBC_for_works_affecting_character]',
      'WORKS[WRK_011] → SPEC[composite_slates + breathable_underfelt]',
      'OBLIGATION[OBL_005] → STATUS[not_started]',
      'ACTION[ACT_007] → OWNER[DM] → STATUS[pending]',
    ],
    confidence: 'deterministic',
  },
  {
    question: 'What is the Section 20 consultation timeline?',
    answer:
      'The Section 20 process under LTA 1985 and Welsh SI 2004/684 requires two 30-day consultation periods. Stage 1: Notice of Intention (authorised by R3) — describes proposed works, invites leaseholder observations for 30 days and allows leaseholders to nominate contractors. Stage 2: Notice of Estimates — presents at least 2 quotes (one from an unconnected contractor), invites observations for a further 30 days. Minimum elapsed time: approximately 10-12 weeks including preparation. However, we cannot issue the Notice of Intention until we have confirmed LBC status (A7), completed the bat survey (A8), completed the asbestos reinspection (A6), and obtained the required quotes (A2).',
    derivationChain: [
      'OBLIGATION[OBL_006] → LEGISLATION[LTA_1985_s20 + SI_2004/684_Wales]',
      'RESOLUTION[R3] → AUTHORISATION[Notice_of_Intention]',
      'PROCESS → STAGE_1[Notice_of_Intention, 30_days] → STAGE_2[Notice_of_Estimates, 30_days]',
      'DEPENDENCIES → OBL_005[LBC] + OBL_004[bat_survey] + OBL_001[asbestos] + OBL_017[quotes]',
      'TIMELINE[min_10-12_weeks_from_first_notice]',
    ],
    confidence: 'deterministic',
  },
  {
    question: 'When was the asbestos survey last done?',
    answer:
      'The last Asbestos Management Survey was conducted in August 2017. The management policy requires reinspection every 24 months, making this significantly overdue (last due August 2019). The survey identified presumed ACMs in the roof slates (Chrysotile, non-friable). Critically, a Refurbishment & Demolition (R&D) survey is required before any roof replacement works. This was prioritised by Resolution R7 at the Board meeting on 19 March 2026, and is Action A6 assigned to DM.',
    derivationChain: [
      'DOCUMENT[DOC_008] → DATE[Aug_2017] → TYPE[management_survey]',
      'POLICY[reinspection_interval=24_months] → NEXT_DUE[Aug_2019] → STATUS[overdue]',
      'FINDING[presumed_ACMs_roof_slates, Chrysotile, non-friable]',
      'OBLIGATION[OBL_001] → PREREQUISITE_FOR[roof_works] → REQUIRES[R&D_survey]',
      'RESOLUTION[R7] → ACTION[A6] → OWNER[DM] → STATUS[pending]',
    ],
    confidence: 'deterministic',
  },
  {
    question: "What are Flat 4's outstanding issues?",
    answer:
      'Flat 4 has one major active issue: persistent water ingress from two entry points. (1) Valley gutter overflow — the outlet to the hopper head is constricted and the valley drains 5 roof areas. (2) Hole behind fascia at the SW corner allowing wind-driven rain. Additionally, Flat 5\'s rear roof drains into Flat 4 guttering, creating a boundary issue (DM declared conflict of interest). The tenant Rad has been living with damage for approximately 15 years. The insurance claim was denied by Sedgwick (maintenance/wear, not storm). The Board authorised an independent surveyor (R4, Action A3, in progress) and interim repairs (R5, Action A4, in progress via NB). Flat 4 also needs a new FD30 fire door per the FRA (in progress, £967.26 via NB, private arrangement).',
    derivationChain: [
      'UNIT[UNIT_004, Flat_4] → ISSUE[ISS_001, water_ingress, severity=high, status=active]',
      'CAUSE_1[valley_gutter_overflow, constricted_outlet, drains_5_roof_areas]',
      'CAUSE_2[hole_behind_fascia_SW_corner, wind-driven_rain]',
      'BOUNDARY[Flat_5_rear_roof → Flat_4_guttering] → CONFLICT[DM_declared]',
      'INSURANCE[claim_denied, Sedgwick_ref_10920933, maintenance_not_storm]',
      'RESOLUTION[R4] → ACTION[A3, independent_surveyor, in_progress]',
      'RESOLUTION[R5] → ACTION[A4, interim_repairs_NB, in_progress]',
      'OBLIGATION[OBL_002] → FIRE_DOOR[FD30, £967.26, NB, in_progress]',
    ],
    confidence: 'deterministic',
  },
  {
    question: 'Can we start roof works before the bat survey?',
    answer:
      'No. The bat survey is a legal prerequisite before any roof works. Under the Wildlife & Countryside Act 1981, section 9, and the Conservation of Habitats and Species Regulations 2017, it is a criminal offence to disturb a bat roost. The RICS Level 3 survey (ref 1814/BS/2024) specifically recommended a bat survey before roof works, given the building\'s age (1790), roof void access, and slate roof construction — all features that increase bat roost potential. The survey can only be conducted between April and September (bat activity season). This is Work Item WRK_001 and a dependency for the main roof contract (WRK_011).',
    derivationChain: [
      'WORKS[WRK_011, roof_replacement] → DEPENDENCY[WRK_001, bat_survey]',
      'OBLIGATION[OBL_004] → LEGISLATION[Wildlife_Countryside_Act_1981_s9]',
      'REGULATION[Conservation_Habitats_Species_2017] → OFFENCE[disturb_bat_roost]',
      'SURVEY[RICS_1814_BS_2024] → RECOMMENDATION[bat_survey_prerequisite]',
      'BUILDING[year_built=1790, roof_void=true, slate_roof=true] → RISK[bat_roost_potential=elevated]',
      'CONSTRAINT[survey_season=April-September]',
      'ANSWER[NO — criminal_offence_risk, legal_prerequisite]',
    ],
    confidence: 'deterministic',
  },
  {
    question: "What's our current financial position?",
    answer:
      'Opening cash balance: £4,242.85 (Lloyds Community Account). Annual operating expenses: £4,839.28 (buildings insurance £3,177.14, D&O insurance £202.14, accountancy £460, gardening £600, admin/filing £100, contingency £300). Service charge has been increased from £100 to £125/month per flat from 1 April 2026 (Resolution R6), giving annual income of £7,500 (5 flats x £125 x 12). Under the Pot Builder scenario (Scenario 2), the 5-year closing balance would be £16,050.46 with no capital works. For Full Replacement (Scenario 3), a capital levy of £10,631 per flat would be needed for estimated works of £51,284. For Interim Fix (Scenario 4), a capital levy of £3,876 per flat for estimated works of £19,380.',
    derivationChain: [
      'FINANCIAL[opening_cash=£4,242.85]',
      'FINANCIAL[bank=Lloyds_Community_Account]',
      'FINANCIAL[operating_expenses_total=£4,839.28]',
      'RESOLUTION[R6] → SERVICE_CHARGE[£125/month_from_Apr_2026]',
      'FINANCIAL[annual_income=5x£125x12=£7,500]',
      'SCENARIO[2_Pot_Builder] → 5YR_CLOSING[£16,050.46]',
      'SCENARIO[3_Full_Replacement] → LEVY[£10,631/flat] → WORKS[£51,284]',
      'SCENARIO[4_Interim_Fix] → LEVY[£3,876/flat] → WORKS[£19,380]',
    ],
    confidence: 'deterministic',
  },
];

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export const messages: Message[] = [
  // Thread: Flat 4 Water Ingress
  {
    id: 'MSG_001',
    author: 'Gareth Barnes',
    authorFlat: 3,
    date: '2026-03-20',
    content: 'Had a look at the Flat 4 rear wall this morning. The pointing along the parapet is badly degraded — you can push a finger into the mortar in places. Water is clearly tracking down from the roof/wall junction into Janet\'s bedroom. NB\'s interim patch won\'t hold through another winter.',
    threadId: 'ISS_002',
    threadType: 'issue',
    threadTitle: 'Flat 4 Water Ingress',
  },
  {
    id: 'MSG_002',
    author: 'Daniel Mohamed',
    authorFlat: 5,
    date: '2026-03-21',
    content: 'Thanks Gareth. I\'ve spoken to the surveyor — he can do an inspection on 2 April. He\'ll scope the Flat 4/5 boundary drainage issue at the same time, which the board asked me to declare a conflict of interest on. Will circulate his brief to all directors before the visit.',
    threadId: 'ISS_002',
    threadType: 'issue',
    threadTitle: 'Flat 4 Water Ingress',
  },
  {
    id: 'MSG_003',
    author: 'Janet Hicks',
    authorFlat: 4,
    date: '2026-03-22',
    content: 'The damp patch has got noticeably worse this week after the rain. I\'ve put a dehumidifier in the bedroom but the wall is wet to the touch. Happy to give the surveyor access whenever needed — just give me 24 hours notice please.',
    threadId: 'ISS_002',
    threadType: 'issue',
    threadTitle: 'Flat 4 Water Ingress',
  },
  // Thread: Fire Door Installation
  {
    id: 'MSG_004',
    author: 'Daniel Mohamed',
    authorFlat: 5,
    date: '2026-03-21',
    content: 'Following up from the board meeting — the FRA requires FD30S doors on all flat entrance doors. I\'ve asked NB to quote for the communal doors first. Each leaseholder is responsible for their own flat door under the lease terms. I\'m getting my Flat 5 door done — anyone else want to coordinate so we can negotiate a bulk rate?',
    threadId: 'ACT_004',
    threadType: 'action',
    threadTitle: 'Fire Door Installation',
  },
  {
    id: 'MSG_005',
    author: 'Gareth Barnes',
    authorFlat: 3,
    date: '2026-03-22',
    content: 'Good idea on the bulk rate. I\'m in for Flat 3. NB did decent work on the last job so happy to use him again. What\'s the rough per-door cost looking like?',
    threadId: 'ACT_004',
    threadType: 'action',
    threadTitle: 'Fire Door Installation',
  },
  {
    id: 'MSG_006',
    author: 'Daniel Mohamed',
    authorFlat: 5,
    date: '2026-03-23',
    content: 'NB quoted around £650-750 per door installed, depending on frame condition. With 3+ doors we might get closer to £600. I\'ll confirm once he\'s assessed all the frames. Ann — would you want Flat 2 included?',
    threadId: 'ACT_004',
    threadType: 'action',
    threadTitle: 'Fire Door Installation',
  },
  // Thread: Section 20 Consultation
  {
    id: 'MSG_007',
    author: 'Daniel Mohamed',
    authorFlat: 5,
    date: '2026-03-24',
    content: 'Quick update on the Section 20 process for the roof works. Stage 1 is the Notice of Intention — I\'m drafting it now. This gives all leaseholders 30 days to nominate a contractor. Stage 2 comes after we have quotes. The whole process takes a minimum of 60 days so we need to get moving if we want works to start before autumn.',
    threadId: 'ACT_001',
    threadType: 'action',
    threadTitle: 'Section 20 Consultation',
  },
  {
    id: 'MSG_008',
    author: 'Ann Davies',
    authorFlat: 2,
    date: '2026-03-25',
    content: 'Thanks Daniel. What happens if Ian (Flat 1) doesn\'t respond to the Section 20 notice? He hasn\'t engaged with anything since the flat went on the market. Do we need all five leaseholders to participate?',
    threadId: 'ACT_001',
    threadType: 'action',
    threadTitle: 'Section 20 Consultation',
  },
  {
    id: 'MSG_009',
    author: 'Daniel Mohamed',
    authorFlat: 5,
    date: '2026-03-25',
    content: 'No — the Section 20 notice just has to be served on all leaseholders. If Ian doesn\'t respond within 30 days, we proceed without his nomination. We\'ll serve it by post and email to cover ourselves. His solicitor should pick it up during any sale conveyancing anyway.',
    threadId: 'ACT_001',
    threadType: 'action',
    threadTitle: 'Section 20 Consultation',
  },
  // Thread: General / WhatsApp & Meetings
  {
    id: 'MSG_010',
    author: 'Ann Davies',
    authorFlat: 2,
    date: '2026-03-20',
    content: 'Thanks everyone for a productive board meeting. I think the WhatsApp group is fine for quick day-to-day things, but for anything that needs a decision trail we should use this system. Much easier to find things later than scrolling back through WhatsApp.',
    threadType: 'general',
    threadTitle: 'Meeting Follow-ups & Communications',
  },
  {
    id: 'MSG_011',
    author: 'Daniel Mohamed',
    authorFlat: 5,
    date: '2026-03-20',
    content: 'Agreed. I\'ll keep the formal minutes and action tracking here. WhatsApp for "the plumber is coming at 2pm" type messages. I\'ve uploaded the draft minutes from Wednesday — can everyone review and let me know of any corrections by end of next week?',
    threadType: 'general',
    threadTitle: 'Meeting Follow-ups & Communications',
  },
  {
    id: 'MSG_012',
    author: 'Gareth Barnes',
    authorFlat: 3,
    date: '2026-03-21',
    content: 'Makes sense. One thing from the minutes — can we add the guttering clean as a separate line item? It was bundled with the roof inspection but it\'s really a routine maintenance task. Happy to get a quote from the lad who does my windows.',
    threadType: 'general',
    threadTitle: 'Meeting Follow-ups & Communications',
  },
];

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export const notifications: Notification[] = [
  {
    id: 'NOTIF_001',
    type: 'compliance_deadline',
    title: 'Asbestos reinspection overdue',
    description: 'Last asbestos management survey was August 2017 — nearly 9 years ago. Annual reinspection required under CAR 2012.',
    date: '2026-03-28',
    read: false,
    linkTo: '/compliance',
  },
  {
    id: 'NOTIF_002',
    type: 'compliance_deadline',
    title: 'EICR overdue — no inspection in 5+ years',
    description: 'No Electrical Installation Condition Report on record for communal areas. Required under BS 7671.',
    date: '2026-03-27',
    read: false,
    linkTo: '/compliance',
  },
  {
    id: 'NOTIF_003',
    type: 'action_assigned',
    title: 'Action A8 assigned to you: Commission bat survey',
    description: 'Bat survey season runs April-September. Needs scheduling before roof works can proceed.',
    date: '2026-03-26',
    read: false,
    linkTo: '/governance',
  },
  {
    id: 'NOTIF_004',
    type: 'message',
    title: 'Ann Davies commented on Section 20 Consultation',
    description: 'What happens if Ian (Flat 1) doesn\'t respond to the Section 20 notice?',
    date: '2026-03-25',
    read: false,
    linkTo: '/messages',
  },
  {
    id: 'NOTIF_005',
    type: 'payment',
    title: 'Service charge demands sent to all leaseholders',
    description: 'New rate of £125/month effective from 1 April 2026. Demands issued with Summary of Rights.',
    date: '2026-03-20',
    read: true,
    linkTo: '/finances',
  },
  {
    id: 'NOTIF_006',
    type: 'resolution',
    title: 'Resolution R2 passed: 5-Year P&L Scenarios adopted',
    description: 'Board adopted Scenario 2 (Pot Builder) as baseline financial plan.',
    date: '2026-03-19',
    read: true,
    linkTo: '/governance',
  },
  {
    id: 'NOTIF_007',
    type: 'compliance_deadline',
    title: 'Flat 1 listed for sale — LPE1 response expected',
    description: 'Hern & Crabtree listing active. Conveyancing solicitor may request LPE1 management pack. Prepare responses.',
    date: '2026-03-18',
    read: true,
    linkTo: '/issues',
  },
  {
    id: 'NOTIF_008',
    type: 'compliance_deadline',
    title: 'Companies House filing deadline approaching',
    description: 'Annual confirmation statement and micro-entity accounts due. Huw Aled to prepare.',
    date: '2026-03-15',
    read: true,
    linkTo: '/governance',
  },
  {
    id: 'NOTIF_009',
    type: 'message',
    title: 'Janet Hicks commented on Flat 4 Water Ingress',
    description: 'The damp patch has got noticeably worse this week after the rain.',
    date: '2026-03-22',
    read: false,
    linkTo: '/messages',
  },
  {
    id: 'NOTIF_010',
    type: 'action_assigned',
    title: 'Action A6 assigned: Commission asbestos reinspection',
    description: 'Urgent — last survey was 2017. Reinspection required before any roof works can commence.',
    date: '2026-03-24',
    read: false,
    linkTo: '/governance',
  },
];

// ---------------------------------------------------------------------------
// Compliance Workflows
// ---------------------------------------------------------------------------

export const workflows: ComplianceWorkflow[] = [
  {
    id: 'WF-001',
    title: 'Section 20 Consultation (Roof Works)',
    description: 'Full statutory consultation process for qualifying works exceeding £250 per leaseholder. This is the most complex and most important compliance workflow for the roof replacement programme.',
    legalBasis: 'LTA 1985 s.20; Service Charges (Consultation Requirements) (Wales) Regulations 2004 (SI 2004/684)',
    category: 'consultation',
    steps: [
      {
        id: 'WF-001-S1',
        title: 'Board resolution authorising works',
        description: 'Formal board resolution to authorise the proposed qualifying works and commence the Section 20 consultation process.',
        status: 'complete',
        completedDate: '2026-03-19',
        notes: 'Passed unanimously with written proxy from JH (R2 + R3)',
      },
      {
        id: 'WF-001-S2',
        title: 'Prepare scope of works specification',
        description: 'Develop a clear, detailed specification of the proposed works that leaseholders and contractors can price against. Must be specific enough for like-for-like comparison.',
        status: 'current',
        notes: 'DM to prepare based on RICS survey findings and NB inspection',
      },
      {
        id: 'WF-001-S3',
        title: 'Issue Notice of Intention (Stage 1)',
        description: 'Formal written notice to ALL qualifying leaseholders describing the proposed works and inviting observations within 30 days. Must also invite nomination of contractors.',
        legalReference: 'Welsh Consultation Regs 2004, Reg 6-7',
        status: 'upcoming',
        warningText: 'The notice must be served on EVERY leaseholder including absentee landlords. Failure invalidates the consultation.',
      },
      {
        id: 'WF-001-S4',
        title: '30-day observation period (Stage 1)',
        description: 'Leaseholders have 30 days from the date of the notice to make written observations and nominate contractors. The 30 days runs from the date ON the notice, not the date of receipt (Trafford Housing Trust v Rubinstein [2013]).',
        status: 'upcoming',
      },
      {
        id: 'WF-001-S5',
        title: 'Consider observations and prepare estimates',
        description: 'The Company must have regard to all observations received. Must obtain at least 2 estimates, including one from a contractor wholly unconnected with any director (Welsh SI 2004/684). If a leaseholder nominated a contractor, an estimate from that contractor must be obtained.',
        status: 'upcoming',
      },
      {
        id: 'WF-001-S6',
        title: 'Issue Statement of Estimates (Stage 2)',
        description: 'Send all estimates to leaseholders with a summary of observations received at Stage 1 and the Company\'s response. Invite further observations within 30 days.',
        legalReference: 'Welsh Consultation Regs 2004, Reg 8-9',
        status: 'upcoming',
      },
      {
        id: 'WF-001-S7',
        title: '30-day observation period (Stage 2)',
        description: 'Leaseholders have a further 30 days to make written observations on the estimates and the Company\'s response to Stage 1 observations.',
        status: 'upcoming',
      },
      {
        id: 'WF-001-S8',
        title: 'Consider Stage 2 observations',
        description: 'Have regard to observations. If the winning contractor is NOT the cheapest, or was NOT nominated by a leaseholder, the Company must provide written reasons to each leaseholder within 21 days of entering the contract.',
        status: 'upcoming',
      },
      {
        id: 'WF-001-S9',
        title: 'Award contract and issue notification',
        description: 'Award the contract and notify all leaseholders of the decision, including written reasons if required.',
        status: 'upcoming',
        warningText: 'If consultation is not followed, the maximum recoverable from each leaseholder via service charge is £250.',
      },
    ],
    linkedObligationIds: ['OBL_003'],
    linkedResolutionIds: ['R2', 'R3'],
  },
  {
    id: 'WF-002',
    title: 'Fire Risk Assessment Follow-up',
    description: 'Process for commissioning, reviewing, and acting on the statutory Fire Risk Assessment for communal areas.',
    legalBasis: 'Regulatory Reform (Fire Safety) Order 2005; Fire Safety (Wales) Regulations 2021',
    category: 'safety',
    steps: [
      {
        id: 'WF-002-S1',
        title: 'Commission FRA from competent person',
        description: 'Engage a suitably qualified fire risk assessor to carry out a Type 1 Fire Risk Assessment of communal areas.',
        status: 'complete',
        completedDate: '2025-12-01',
        notes: 'Capital Fire Protection',
      },
      {
        id: 'WF-002-S2',
        title: 'Review FRA findings and identify remedial actions',
        description: 'Review the FRA report, identify all remedial actions with priority ratings, and assign responsibility for each action.',
        status: 'complete',
        notes: 'FD30 fire doors needed at Flats 4 & 5; communal lighting requires investigation; escape routes clear',
      },
      {
        id: 'WF-002-S3',
        title: 'Implement priority remedial actions',
        description: 'Fire doors: NB instructed, £967.26 for Flats 4+5 (private arrangement per R6). Communal lighting: electrician to be commissioned (A9).',
        status: 'current',
      },
      {
        id: 'WF-002-S4',
        title: 'Record actions in Health & Safety Register',
        description: 'Document all actions taken, with dates and evidence, in the building\'s Health & Safety Register.',
        status: 'upcoming',
      },
      {
        id: 'WF-002-S5',
        title: 'Schedule next FRA',
        description: 'Every 3 years or after significant works (e.g. roof replacement). Next due: December 2028 at latest.',
        status: 'upcoming',
        warningText: 'The Company is the \'Responsible Person\' under the Fire Safety Order. Directors carry personal liability for fire safety in communal areas.',
      },
    ],
    linkedObligationIds: ['OBL_002'],
    linkedResolutionIds: ['R6'],
  },
  {
    id: 'WF-003',
    title: 'Service Charge Demand Process',
    description: 'End-to-end process for setting, preparing, and serving service charge demands in compliance with statutory requirements.',
    legalBasis: 'LTA 1985 ss.18-30; LTA 1987 s.42, s.47, s.48',
    category: 'financial',
    steps: [
      {
        id: 'WF-003-S1',
        title: 'Board approves service charge level',
        description: 'Formal board resolution approving the service charge amount, supported by a budget or expenditure forecast.',
        status: 'complete',
        completedDate: '2026-03-19',
        notes: 'R2, 19 Mar 2026',
      },
      {
        id: 'WF-003-S2',
        title: 'Prepare demand in prescribed form',
        description: 'Must include: Company name and address (s.47 LTA 1987, s.48 — address for service of notices); amount; payment terms; the demand itself.',
        status: 'complete',
      },
      {
        id: 'WF-003-S3',
        title: 'Attach Summary of Rights and Obligations',
        description: 'MANDATORY for Wales: bilingual summary per SI 2007/3160. A demand served without this is not recoverable until the summary is provided.',
        status: 'complete',
        warningText: 'This is the single most common error in service charge administration. Without the summary, the demand is unenforceable.',
      },
      {
        id: 'WF-003-S4',
        title: 'Serve on all leaseholders',
        description: 'Serve the demand on every leaseholder, ensuring delivery to the correct address (including letting agents for absentee leaseholders).',
        status: 'complete',
        completedDate: '2026-03-20',
        notes: 'Demands sent to all 5 leaseholders. Flat 4 via Northwood (letting agent) and directly to JH.',
      },
      {
        id: 'WF-003-S5',
        title: 'Statutory trust: hold funds on trust',
        description: 's.42 LTA 1987: service charge contributions held on trust for contributing leaseholders. Lloyds Community Account designated for this purpose.',
        status: 'complete',
        warningText: 'Commingling service charge funds with personal accounts is a breach of statutory trust.',
      },
      {
        id: 'WF-003-S6',
        title: '18-month time limit for demands',
        description: 's.20B LTA 1985: costs must be demanded within 18 months of being incurred, or the leaseholder must have been notified that costs were incurred and that a demand will follow. Set calendar reminder.',
        status: 'upcoming',
        warningText: 'Miss this deadline and the costs are irrecoverable.',
      },
    ],
    linkedObligationIds: ['OBL_005'],
    linkedResolutionIds: ['R2'],
  },
  {
    id: 'WF-004',
    title: 'Companies House Compliance',
    description: 'Ongoing statutory filing and governance obligations for Cathedral Green Management Company Limited.',
    legalBasis: 'Companies Act 2006',
    category: 'company',
    steps: [
      {
        id: 'WF-004-S1',
        title: 'Annual confirmation statement',
        description: 'Must be filed within 14 days of the review date. Confirms director details, registered office, SIC codes, PSC register are correct.',
        status: 'current',
        warningText: 'Late filing is a criminal offence. Each director is personally liable.',
      },
      {
        id: 'WF-004-S2',
        title: 'Annual accounts',
        description: 'Micro-entity accounts acceptable for CGMC. Must be filed within 9 months of the accounting reference date.',
        status: 'upcoming',
      },
      {
        id: 'WF-004-S3',
        title: 'Director verification',
        description: 'All directors must verify their identity on Companies House. Deadline noted by Ann in November 2025 correspondence.',
        status: 'current',
      },
      {
        id: 'WF-004-S4',
        title: 'Maintain statutory registers',
        description: 'Register of members, register of directors, register of PSCs. Can be kept at Companies House or at the registered office.',
        status: 'upcoming',
      },
      {
        id: 'WF-004-S5',
        title: 'Notify changes within 14 days',
        description: 'Any change to directors, registered office, or PSCs must be notified within 14 days. Relevant if Flat 1 or Flat 3 sell.',
        status: 'upcoming',
      },
    ],
    linkedObligationIds: ['OBL_009'],
    linkedResolutionIds: [],
  },
];

// ---------------------------------------------------------------------------
// Work Projects
// ---------------------------------------------------------------------------

export const workProjects: WorkProject[] = [
  {
    id: 'WP-001',
    workItemId: 'W_002',
    title: 'Roof Replacement Programme',
    description: 'Full roof replacement for Yr Hen Dy, from ecological survey through to practical completion. The largest and most complex capital project for the building.',
    status: 'planning',
    budget: '£51,284 (Scenario 3) — based on expired Cardiff & Vale quote, new quotes needed',
    stages: [
      { id: 'WP-001-S1', title: 'Ecological survey (bats)', status: 'upcoming', notes: 'Must be Apr-Sep. Criminal offence to disturb roosts without survey.' },
      { id: 'WP-001-S2', title: 'Asbestos R&D survey', status: 'upcoming', notes: 'Existing slates contain presumed ACMs (Chrysotile). R&D survey required before removal.' },
      { id: 'WP-001-S3', title: 'Listed Building Consent', status: 'upcoming', notes: 'Confirmation needed from Cadw + Cardiff LPA' },
      { id: 'WP-001-S4', title: 'Section 20 consultation', status: 'upcoming', notes: 'See workflow WF-001 for full process' },
      { id: 'WP-001-S5', title: 'Contractor procurement', status: 'upcoming', notes: 'Min 2 quotes, one from unconnected contractor' },
      { id: 'WP-001-S6', title: 'Scaffolding and site setup', status: 'upcoming' },
      { id: 'WP-001-S7', title: 'Strip existing roof covering', status: 'upcoming', notes: 'Asbestos disposal protocol required' },
      { id: 'WP-001-S8', title: 'Install new roof system', status: 'upcoming', notes: 'Breathable underfelt + treated batten + Thrutone composite slates + code 4 lead valleys' },
      { id: 'WP-001-S9', title: 'Practical completion and snagging', status: 'upcoming' },
      { id: 'WP-001-S10', title: 'Commission new FRA', status: 'upcoming', notes: 'Required after significant works per Fire Safety Policy' },
    ],
    linkedMessages: [],
  },
  {
    id: 'WP-002',
    workItemId: 'W_005',
    title: 'Fire Door Installation (Flats 4 & 5)',
    description: 'Installation of FD30 fire doors at Flats 4 and 5, as identified by the December 2025 Fire Risk Assessment.',
    status: 'in_progress',
    budget: '£967.26 inc VAT',
    contractor: 'Nigel Barnes (NB)',
    stages: [
      { id: 'WP-002-S1', title: 'FRA identifies requirement', status: 'complete', completedDate: '2025-12-01' },
      { id: 'WP-002-S2', title: 'Source FD30 doors and ironmongery', status: 'complete', notes: 'NB (Nigel Barnes) sourcing. Quote £967.26 inc VAT for both flats.' },
      { id: 'WP-002-S3', title: 'Leaseholder agreement on costs', status: 'complete', notes: 'Private arrangement — not service charge funded. JH and DM paying directly.' },
      { id: 'WP-002-S4', title: 'Schedule installation', status: 'current', notes: 'Coordinate with NB availability and tenant access (Flat 4 — Rad via Northwood)' },
      { id: 'WP-002-S5', title: 'Install and certify', status: 'upcoming' },
      { id: 'WP-002-S6', title: 'Update FRA action log', status: 'upcoming' },
      { id: 'WP-002-S7', title: 'Photograph and record in building register', status: 'upcoming' },
    ],
    linkedMessages: [],
  },
  {
    id: 'WP-003',
    workItemId: 'W_003',
    title: 'Flat 4 Interim Repairs',
    description: 'Targeted interim repairs to address water ingress at Flat 4 and associated drainage and chimney issues, pending the main roof replacement.',
    status: 'planning',
    stages: [
      { id: 'WP-003-S1', title: 'Board authorisation', status: 'complete', completedDate: '2026-03-19', notes: 'R5, 19 Mar 2026' },
      { id: 'WP-003-S2', title: 'Independent surveyor inspection', status: 'current', notes: 'Surveyor appointment confirmed, scope includes Flat 4/5 boundary drainage' },
      { id: 'WP-003-S3', title: 'Surveyor report and recommendations', status: 'upcoming' },
      { id: 'WP-003-S4', title: 'Scope interim works specification', status: 'upcoming', notes: 'Valley gutter constriction, fascia hole at SW corner, chimney above Flat 4' },
      { id: 'WP-003-S5', title: 'Check Section 20 threshold', status: 'upcoming', notes: 'If cost per leaseholder exceeds £250, consultation required. Individual items may be separable (Francis v Phillips [2014]).' },
      { id: 'WP-003-S6', title: 'Instruct contractor', status: 'upcoming' },
      { id: 'WP-003-S7', title: 'Complete works and inspect', status: 'upcoming' },
      { id: 'WP-003-S8', title: 'Update insurance claim evidence', status: 'upcoming', notes: 'Works completion strengthens position if re-opening claim with Sedgwick' },
    ],
    linkedMessages: [],
  },
];

// ---------------------------------------------------------------------------
// Combined Knowledge Graph Export
// ---------------------------------------------------------------------------

export const quoteRequests: QuoteRequest[] = [
  {
    id: 'QR_001',
    title: 'Full Roof Replacement \u2014 Yr Hen Dy, 5 Cathedral Green',
    description: 'Strip and replace man-made slate roof covering to main roof pitches. Install breathable underfelt, treated battens, and Thrutone composite slates or equivalent. Replace all code 4 lead valleys and flashings. Install dry-fix ridge system. Include for scaffold access.',
    buildingContext: 'Grade II listed building, conservation area, 3-storey, mansard roof with dormers, built c.1790. Presumed asbestos-containing materials in existing slates (Chrysotile, non-friable) \u2014 R&D asbestos survey and licensed removal required. Bat survey required before works (Apr\u2013Sep season). Listed Building Consent may be required \u2014 confirmation pending from Cadw and Cardiff LPA.',
    specialRequirements: [
      'Grade II listed \u2014 natural or approved composite slates only',
      'Asbestos removal \u2014 licensed contractor required for existing slates',
      'Bat survey clearance required before commencement',
      'Conservation area \u2014 sympathetic materials and methods',
      'Welsh consultation regs \u2014 at least one quote must be from a contractor wholly unconnected with any director (SI 2004/684)',
    ],
    estimatedBudget: '\u00a320,000\u2013\u00a330,000 + VAT',
    status: 'quotes_received',
    section20Required: true,
    section20Status: 'Notice of Intention \u2014 pending',
    linkedWorkItemId: 'WRK_002',
    publishedDate: '2026-04-15',
    closingDate: '2026-05-15',
    quotes: [
      {
        id: 'CQ_001',
        contractorName: 'Cardiff & Vale Roofing Ltd',
        contactEmail: 'info@cardiffvaleroofing.co.uk',
        amount: 23605,
        vatAmount: 4721,
        totalInclVat: 28326,
        validUntil: '2024-08-19',
        scope: 'Full roof replacement as per QT24477-2',
        isConnectedToDirector: false,
        heritageCertified: true,
        asbestosLicensed: false,
        submittedDate: '2024-05-19',
        notes: 'Quote expired \u2014 renewal requested. Chimney refurbishment (\u00a31,850+VAT/stack) and fascia/rainwater goods (\u00a31,850+VAT) available as optional extras.',
      },
      {
        id: 'CQ_002',
        contractorName: 'Heritage Roofing Wales',
        contactEmail: 'quotes@heritageroofingwales.co.uk',
        amount: 27400,
        vatAmount: 5480,
        totalInclVat: 32880,
        validUntil: '2026-07-20',
        scope: 'Full strip and re-roof including licensed asbestos removal, breathable membrane, treated battens, Welsh slate effect composite tiles, code 4 lead valleys, dry ridge.',
        isConnectedToDirector: false,
        heritageCertified: true,
        asbestosLicensed: true,
        submittedDate: '2026-04-20',
      },
    ],
  },
  {
    id: 'QR_002',
    title: 'FD30 Fire Door Supply and Installation \u2014 Flats 4 & 5',
    description: 'Supply and install FD30 fire doors to Flats 4 and 5 front doors. Doors to be certified fire-rated assemblies including intumescent strips and cold smoke seals.',
    buildingContext: 'Grade II listed building, conservation area. Fire risk assessment identified non-compliant flat entrance doors. Building has shared escape route via central staircase.',
    specialRequirements: [],
    status: 'awarded',
    section20Required: false,
    quotes: [
      {
        id: 'CQ_003',
        contractorName: 'Nigel Barnes',
        contactEmail: 'nigel.barnes@example.com',
        amount: 806.05,
        vatAmount: 161.21,
        totalInclVat: 967.26,
        validUntil: '2026-06-30',
        scope: 'Supply and fit 2x FD30 fire doors to Flats 4 & 5',
        isConnectedToDirector: true,
        heritageCertified: false,
        submittedDate: '2026-03-01',
        notes: 'Private arrangement between leaseholders and NB \u2014 not service charge funded, Section 20 not applicable.',
      },
    ],
  },
  {
    id: 'QR_003',
    title: 'Independent Surveyor \u2014 Root Cause Investigation, Flat 4 Water Ingress',
    description: 'Appoint independent building surveyor to investigate and report on root causes of persistent water ingress into Flat 4. Scope must address: (1) valley gutter overflow and constricted outlet; (2) hole behind fascia at SW corner; (3) Flat 4/5 boundary drainage connection. Surveyor must be independent of all directors.',
    buildingContext: 'Grade II listed building. Persistent water ingress to Flat 4 (ground floor) linked to roof drainage defects. Previous insurance claim declined. Valley gutter between main roof and Flat 5 rear roof identified as primary failure point. Flat 5 rear roof drains into Flat 4 guttering \u2014 potential liability/conflict issue.',
    specialRequirements: [
      'Must be RICS-registered',
      'Must have experience with listed buildings',
      'Scope must address conflict of interest \u2014 Flat 5 rear roof drains into Flat 4 guttering',
      'Report must be suitable for potential use in insurance claim re-submission',
    ],
    estimatedBudget: '\u00a3500\u2013\u00a31,500',
    status: 'draft',
    section20Required: false,
    section20Status: undefined,
    linkedWorkItemId: undefined,
    quotes: [],
  },
];

// ---------------------------------------------------------------------------
// Help Links — free advice for leaseholders
// ---------------------------------------------------------------------------

export const helpLinks: HelpLink[] = [
  {
    id: 'HELP_001',
    title: 'About service charges',
    description: 'What service charges cover, how they should be calculated, and your rights as a leaseholder.',
    url: 'https://www.lease-advice.org/advice-guide/service-charges/',
    source: 'LEASE',
    relevantTo: ['service charges', 'money', 'demands'],
  },
  {
    id: 'HELP_002',
    title: 'Responding to Section 20 consultation',
    description: 'What happens during a Section 20 consultation, your right to be consulted, and how to respond.',
    url: 'https://www.lease-advice.org/advice-guide/section-20-consultation/',
    source: 'LEASE',
    relevantTo: ['section 20', 'consultation', 'major works'],
  },
  {
    id: 'HELP_003',
    title: 'Water leaks in leasehold flats',
    description: 'Who is responsible for water leaks, how to get repairs done, and what your lease says.',
    url: 'https://www.lease-advice.org/advice-guide/water-leaks-in-leasehold-flats/',
    source: 'LEASE',
    relevantTo: ['water', 'leaks', 'damp', 'repairs'],
  },
  {
    id: 'HELP_004',
    title: 'Running a management company',
    description: 'Your rights and responsibilities when leaseholders manage their own building through RTM or a residents\u2019 company.',
    url: 'https://www.lease-advice.org/advice-guide/right-to-manage/',
    source: 'LEASE',
    relevantTo: ['management company', 'directors', 'right to manage'],
  },
  {
    id: 'HELP_005',
    title: 'Buying a share of the freehold',
    description: 'How collective enfranchisement works and what\u2019s involved in buying the freehold together.',
    url: 'https://www.lease-advice.org/advice-guide/collective-enfranchisement/',
    source: 'LEASE',
    relevantTo: ['freehold', 'enfranchisement', 'buying'],
  },
  {
    id: 'HELP_006',
    title: 'Leasehold reform',
    description: 'The latest changes to leasehold law and how they might affect you.',
    url: 'https://www.lease-advice.org/advice-guide/leasehold-reform/',
    source: 'LEASE',
    relevantTo: ['reform', 'law changes', 'your rights'],
  },
  {
    id: 'HELP_007',
    title: 'Fire safety in residential buildings',
    description: 'Government guidance on fire safety responsibilities for residential buildings.',
    url: 'https://www.gov.uk/government/collections/fire-safety-in-residential-buildings',
    source: 'Gov.uk',
    relevantTo: ['fire safety', 'fire risk assessment', 'safety'],
  },
  {
    id: 'HELP_008',
    title: 'Asbestos management',
    description: 'Your duty to manage asbestos in non-domestic premises, including communal areas.',
    url: 'https://www.hse.gov.uk/asbestos/duty.htm',
    source: 'Gov.uk',
    relevantTo: ['asbestos', 'safety', 'surveys'],
  },
  {
    id: 'HELP_009',
    title: 'Listed building consent',
    description: 'What you need to know before making changes to a listed building in Wales.',
    url: 'https://cadw.gov.wales/advice-support/historic-assets/listed-buildings',
    source: 'Cadw',
    relevantTo: ['listed building', 'consent', 'heritage', 'planning'],
  },
  {
    id: 'HELP_010',
    title: 'File your confirmation statement',
    description: 'How to file your company\u2019s annual confirmation statement and accounts with Companies House.',
    url: 'https://www.gov.uk/file-your-company-annual-accounts',
    source: 'Companies House',
    relevantTo: ['companies house', 'filing', 'annual return', 'accounts'],
  },
  {
    id: 'HELP_011',
    title: 'Directors\u2019 duties',
    description: 'What the law expects of company directors \u2014 including volunteer directors of management companies.',
    url: 'https://www.gov.uk/guidance/being-a-company-director',
    source: 'Companies House',
    relevantTo: ['directors', 'duties', 'company law'],
  },
  {
    id: 'HELP_012',
    title: 'Disputes with your landlord or managing agent',
    description: 'How to resolve disputes about service charges, repairs, or management \u2014 including the First-tier Tribunal.',
    url: 'https://www.lease-advice.org/advice-guide/disputes/',
    source: 'LEASE',
    relevantTo: ['disputes', 'tribunal', 'complaints', 'insurance'],
  },
  {
    id: 'HELP_013',
    title: 'Building safety',
    description: 'Your rights under the Building Safety Act and what it means for leaseholders.',
    url: 'https://www.lease-advice.org/advice-guide/building-safety/',
    source: 'LEASE',
    relevantTo: ['building safety', 'safety', 'cladding'],
  },
  {
    id: 'HELP_014',
    title: 'Renting Homes Wales',
    description: 'The Renting Homes (Wales) Act and what it means for landlords and tenants in Wales.',
    url: 'https://www.gov.wales/renting-homes',
    source: 'Gov.uk',
    relevantTo: ['renting', 'tenants', 'wales', 'letting'],
  },
];

// ---------------------------------------------------------------------------
// Building Log — chronological record of everything
// ---------------------------------------------------------------------------

export const buildingLog: BuildingLogEntry[] = [
  {
    id: 'LOG_001',
    date: '2017-08-15',
    type: 'inspection',
    title: 'Asbestos management survey completed',
    description: 'Type 2 asbestos management survey carried out across all communal areas. Asbestos-containing materials identified in several locations. Management plan put in place.',
  },
  {
    id: 'LOG_002',
    date: '2024-08-20',
    type: 'inspection',
    title: 'Roof survey by Cardiff & Vale Roofing',
    description: 'Cardiff & Vale Roofing carried out a detailed roof survey. Conclusion: the roof is at end of life and needs full replacement within the next 2\u20133 years. Valley gutters and flashings in poor condition.',
  },
  {
    id: 'LOG_003',
    date: '2024-09-12',
    type: 'inspection',
    title: 'RICS Level 3 building survey by Lapider',
    description: 'Comprehensive building survey commissioned by incoming leaseholders. Identified roof, guttering, chimney, and dampness issues. Recommended prioritised programme of works.',
    linkedDocumentId: 'DOC_002',
  },
  {
    id: 'LOG_004',
    date: '2024-10-02',
    type: 'decision',
    title: 'Flat 5 conveyancing completed',
    description: 'DM & KH completed purchase of Flat 5 and became leaseholders and directors of the management company.',
  },
  {
    id: 'LOG_005',
    date: '2025-11-01',
    type: 'issue_reported',
    title: 'Water damage in Flat 4 reported',
    description: 'Tenant Rad reported significant water ingress in Flat 4, with water coming through the ceiling during heavy rain. Damage to plaster and decoration.',
    reportedBy: 'Rad (Flat 4 tenant)',
    linkedIssueId: 'ISS_001',
  },
  {
    id: 'LOG_006',
    date: '2025-12-05',
    type: 'correspondence',
    title: 'Insurance claim lodged with Sedgwick',
    description: 'Formal insurance claim submitted to Sedgwick (loss adjusters for Allianz) regarding the water damage in Flat 4. Claim reference: 10920933.',
    linkedIssueId: 'ISS_001',
  },
  {
    id: 'LOG_007',
    date: '2025-12-10',
    type: 'inspection',
    title: 'Fire Risk Assessment by Capital Fire Protection',
    description: 'Annual fire risk assessment completed for all communal areas. Several recommendations made including improved signage and fire door checks.',
  },
  {
    id: 'LOG_008',
    date: '2026-01-14',
    type: 'correspondence',
    title: 'Sedgwick denies insurance claim',
    description: 'Sedgwick assessed the Flat 4 water damage claim and denied it, stating the cause is maintenance/wear and tear rather than storm damage.',
    linkedIssueId: 'ISS_001',
  },
  {
    id: 'LOG_009',
    date: '2026-01-20',
    type: 'financial',
    title: 'Ian Clark pays \u00A3150 service charge shortfall',
    description: 'Ian Clark (Flat 3 leaseholder) paid the \u00A3150 shortfall on his service charge account following the reconciliation exercise.',
  },
  {
    id: 'LOG_010',
    date: '2026-02-17',
    type: 'correspondence',
    title: 'Gareth challenges insurance denial',
    description: 'Gareth (Flat 4 leaseholder) formally challenged Sedgwick\u2019s denial of the insurance claim, arguing the damage was caused by a specific storm event.',
    linkedIssueId: 'ISS_001',
  },
  {
    id: 'LOG_011',
    date: '2026-02-18',
    type: 'correspondence',
    title: 'Sedgwick upholds denial',
    description: 'Sedgwick responded to Gareth\u2019s challenge and upheld the original denial. The claim remains closed. Directors may wish to seek advice on further options.',
    linkedIssueId: 'ISS_001',
  },
  {
    id: 'LOG_012',
    date: '2026-03-01',
    type: 'decision',
    title: 'Flat 1 listed for sale',
    description: 'Ann (Flat 1 leaseholder and director) has listed her flat for sale. This will trigger a change in the management company directorship once the sale completes.',
  },
  {
    id: 'LOG_013',
    date: '2026-03-06',
    type: 'decision',
    title: 'Coach House planning permission granted',
    description: 'Cardiff Council granted planning permission for the Coach House development next door. This may affect access, parking, and boundary walls during construction.',
  },
  {
    id: 'LOG_014',
    date: '2026-03-07',
    type: 'correspondence',
    title: 'Management plan v2.3 circulated',
    description: 'Updated management plan circulated to all leaseholders ahead of the board meeting, including the 5-year financial projections and works programme.',
  },
  {
    id: 'LOG_015',
    date: '2026-03-11',
    type: 'correspondence',
    title: 'Board meeting notice issued',
    description: 'Formal notice of the directors\u2019 meeting on 19 March 2026 sent to all leaseholders with the agenda and supporting documents.',
  },
  {
    id: 'LOG_016',
    date: '2026-03-19',
    type: 'meeting',
    title: 'Board meeting \u2014 10 resolutions passed',
    description: 'Directors\u2019 meeting held at Ann\u2019s flat. All 5 directors present. 10 resolutions passed covering roof works, service charges, fire safety, insurance, and the management plan.',
  },
  {
    id: 'LOG_017',
    date: '2026-03-20',
    type: 'financial',
    title: 'Service charge demands issued',
    description: 'New service charge demand letters sent to all 5 leaseholders. Monthly charge increased to \u00A3225 per flat from April 2026, with bilingual Summary of Rights and Obligations enclosed.',
  },
  {
    id: 'LOG_018',
    date: '2026-03-20',
    type: 'decision',
    title: 'WhatsApp group suggested',
    description: 'Following the board meeting, directors agreed to set up an informal WhatsApp group for day-to-day building matters alongside the formal HomeBase message board.',
  },
];

export const knowledgeGraph: KnowledgeGraph = {
  building,
  units,
  obligations,
  documents,
  resolutions,
  actions,
  financials,
  issues,
  worksProgramme,
  parties,
  assistantQA,
  messages,
  notifications,
  workflows,
  workProjects,
  quoteRequests,
  helpLinks,
  buildingLog,
};

export default knowledgeGraph;
