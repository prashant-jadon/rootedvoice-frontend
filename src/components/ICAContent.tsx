import { useState, useEffect } from 'react';

const SignatureImage = ({ src, alt }: { src: string; alt: string }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let revoke = '';
    fetch(src)
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.blob(); })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        revoke = url;
        setBlobUrl(url);
      })
      .catch((err) => { console.error('Signature load failed:', src, err); setFailed(true); });
    return () => { if (revoke) URL.revokeObjectURL(revoke); };
  }, [src]);

  if (failed) return <span className="text-gray-500 italic text-xs">Signature on file</span>;
  if (!blobUrl) return <span className="text-gray-400 text-xs">Loading...</span>;
  return <img src={blobUrl} alt={alt} className="max-h-12 object-contain" />;
};

interface ICAContentProps {
  signedData?: {
    effectiveDate?: string;
    contractorName?: string;
    contractorAddress?: string;
    contractorEmail?: string;
    contractorSignatureUrl?: string;
    contractorSignedAt?: string;
    companySignerName?: string;
    companySignerTitle?: string;
    companySignatureUrl?: string;
    companySignedAt?: string;
  };
}

const FilledField = ({ value }: { value?: string }) => (
  value
    ? <span className="font-semibold text-black underline decoration-dotted underline-offset-4 px-1">{value}</span>
    : <span className="inline-block border-b border-gray-400 w-48" />
);

export default function ICAContent({ signedData }: ICAContentProps = {}) {
  const s = signedData;
  const effectiveDate = s?.effectiveDate ? new Date(s.effectiveDate) : null;
  const dayNum = effectiveDate ? effectiveDate.getDate().toString() : undefined;
  const monthName = effectiveDate ? effectiveDate.toLocaleDateString('en-US', { month: 'long' }) : undefined;
  const yearSuffix = effectiveDate ? effectiveDate.getFullYear().toString().slice(2) : undefined;

  const companyName = s?.companySignerName || 'Ashley Blocker Wilbourn';
  const companyTitle = s?.companySignerTitle || 'Founder & CEO';

  return (
    <div className="ica-content text-gray-800 text-sm leading-relaxed">
      <h2 className="text-xl font-bold text-black text-center mb-1">INDEPENDENT CONTRACTOR AGREEMENT</h2>

      <p className="mb-4">
        This Independent Contractor Agreement (&quot;Agreement&quot;) is entered into as of the <FilledField value={dayNum} /> day
        of <FilledField value={monthName} />, 20<FilledField value={yearSuffix} /> (&quot;Effective Date&quot;), by and between <strong>ROOTED
        VOICES SPEECH &amp; LANGUAGE THERAPY, LLC</strong>, a Louisiana Limited Liability Company
        and a telehealth service provider (&quot;Company&quot;), and
        <FilledField value={s?.contractorName} /> (&quot;Contractor&quot;) of
        <FilledField value={s?.contractorAddress} />(Address).
      </p>

      {/* ARTICLE 1 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 1 &ndash; DEFINITIONS</h3>
      <p className="mb-2"><strong>1.1</strong> &quot;Services&quot; means speech-language therapy services delivered via telehealth in any jurisdiction where Contractor is properly licensed and authorized to practice.</p>
      <p className="mb-2"><strong>1.2</strong> &quot;Platform Systems&quot; means all Company-approved Platform digital systems, technology environments, platforms, applications, software, operational systems, and communication tools utilized in connection with the Services, including but not limited to: website systems; mobile applications; telehealth systems; scheduling systems; communication systems; documentation systems; AI-assisted documentation systems; transcription systems; translation systems; operational software; payment-processing systems; client-management systems; messaging systems; digital workflows; and any current or future Company-approved platform digital environments, technologies, applications, or operational platforms utilized in connection with Company operations or Services.</p>
      <p className="mb-2"><strong>1.3</strong> &quot;Client&quot; means any individual receiving Services through the Company in any applicable jurisdiction.</p>
      <p className="mb-2"><strong>1.4</strong> &quot;Applicable Law&quot; means all federal, state, and local laws governing telehealth services in the jurisdiction where Services are performed.</p>
      <p className="mb-2"><strong>1.5</strong> &quot;Service Jurisdiction&quot; means the state in which the Client is physically located at the time Services are rendered.</p>

      {/* ARTICLE 2 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 2 &ndash; INDEPENDENT CONTRACTOR RELATIONSHIP</h3>
      <p className="mb-2"><strong>2.1 Status.</strong> Contractors are engaged as independent contractors and not as employees. Nothing in this Agreement shall be construed to create a partnership, joint venture, or employment relationship.</p>
      <p className="mb-2"><strong>2.2 Compliance with Applicable Law.</strong> The parties intend to comply with all applicable federal, state, and local laws and regulations governing independent contractor relationships, including but not limited to applicable wage payment laws, worker classification standards, and tax regulations. The parties acknowledge that Contractor is engaged as an independent contractor under applicable law and not as an employee. Contractor retains sole control over the manner and means of performing the Services, subject only to the requirements and specifications set forth in this Agreement.</p>
      <p className="mb-2"><strong>2.3 No Benefits.</strong> Contractor is not entitled to employee benefits, including health insurance, retirement benefits, or paid leave.</p>
      <p className="mb-2"><strong>2.4 No Withholding.</strong> The Company shall not withhold taxes. Contractors are solely responsible for federal, state, and local taxes.</p>
      <p className="mb-2"><strong>2.5 Control of Work.</strong> Contractor shall determine scheduling, methods, and clinical approach, subject only to professional standards and platform requirements.</p>

      {/* ARTICLE 3 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 3 &ndash; SCOPE OF SERVICES</h3>
      <p className="mb-2"><strong>3.1</strong> Contractor shall provide telehealth speech-language therapy services consistent with licensure and applicable standards of care.</p>
      <p className="mb-2"><strong>3.2 Documentation.</strong> Contractor shall maintain accurate, complete, and timely documentation in compliance with applicable laws, professional standards, Company policies, and platform requirements. Documentation shall include therapy notes, evaluations, treatment plans, progress reports, discharge summaries, and other records reasonably required for the performance of Services. All documentation shall be completed through Company-approved Platform systems in accordance with this Agreement.</p>
      <p className="mb-2"><strong>3.3 Use of Company-approved Platform Systems.</strong> Contractors shall use only Company-approved Platform Systems, platforms, applications, and technology for services, communications, scheduling, documentation, recordkeeping, telehealth sessions, and payment processing relating to Platform Clients. Contractor shall comply with all applicable Company operational, confidentiality, HIPAA, and data security requirements when utilizing such systems.</p>
      <p className="mb-2"><strong>3.4 Contractor Responsiveness.</strong> To support client continuity, scheduling efficiency, and Platform operations, Contractor agrees to use commercially reasonable efforts to timely review and respond to client referral opportunities, scheduling requests, client-match opportunities, and other service opportunities made available through the Company-approved Platform. Whenever reasonably practicable, Contractor is expected to respond within forty-eight (48) business hours after such opportunity becomes available or notice thereof is provided.</p>
      <p className="mb-2">The parties acknowledge and agree that Contractor retains sole discretion regarding whether to accept, decline, or make themselves available for any particular client, referral, caseload opportunity, schedule, or assignment. Nothing in this Agreement shall be construed to require Contractor to accept any client, maintain any minimum availability, work any minimum number of hours, or perform Services at any specific time. This provision is intended solely to promote timely communication and efficient Platform operations consistent with Contractor&apos;s status as an independent contractor.</p>
      <p className="mb-2"><strong>3.5</strong> Contractor shall comply with all federal and state healthcare laws and ethical standards, including American Speech-Language-Hearing Association (ASHA) guidelines.</p>
      <p className="mb-2"><strong>3.6</strong> The Contractor shall perform services as outlined in Exhibit A (Scope of Services), which is incorporated herein by reference.</p>

      {/* ARTICLE 4 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 4 &ndash; COMPENSATION</h3>
      <p className="mb-2"><strong>4.1 Compensation Structure.</strong> Compensation shall be as outlined in Exhibit B (Compensation Schedule).</p>
      <p className="mb-2"><strong>4.2 Payment Schedule.</strong> Payments shall be made on a biweekly basis.</p>
      <p className="mb-2"><strong>4.3 Conditions.</strong> Payment is contingent upon proper documentation, attendance, and compliance with Company policies.</p>
      <p className="mb-2"><strong>4.4 Adjustments.</strong> The Company reserves the right to modify compensation rates, payment structures, incentives, or applicable rate schedules upon reasonable prior written notice to Contractor. Any such modification shall apply prospectively only and shall not retroactively affect compensation earned for Services completed prior to the effective date of the modification.</p>
      <p className="mb-2"><strong>4.5 Chargebacks.</strong> The Company may offset payments for refunds, cancellations, or errors.</p>

      {/* ARTICLE 5 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 5 &ndash; TAX TREATMENT</h3>
      <p className="mb-2">Contractor shall receive IRS Form 1099-NEC. The contractor is responsible for all tax obligations.</p>

      {/* ARTICLE 6 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 6 &ndash; HIPAA AND CONFIDENTIALITY</h3>
      <p className="mb-2"><strong>6.1</strong> Contractor shall comply with the Health Insurance Portability and Accountability Act (HIPAA) and all applicable privacy laws.</p>
      <p className="mb-2"><strong>6.2</strong> Contractor shall safeguard Protected Health Information (PHI).</p>
      <p className="mb-2"><strong>6.3 Business Associate Agreement.</strong> Exhibit D (HIPAA / Business Associate Addendum) constitutes the complete Business Associate Agreement (&quot;BAA&quot;) between the Company and Contractor with respect to the Services performed under this Agreement and is incorporated into and made a part of this Agreement. Contractor agrees to comply with all obligations set forth in Exhibit D. No separate Business Associate Agreement or additional BAA signature shall be required unless otherwise required by applicable law or expressly agreed to in writing by the parties.</p>
      <p className="mb-2"><strong>6.4 HIPAA Compliance.</strong> Contractor shall comply with Exhibit D, all applicable HIPAA requirements, and all applicable federal and state privacy and data-security laws governing the Services.</p>

      {/* ARTICLE 7 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 7 &ndash; NON-SOLICITATION AND NON-CIRCUMVENTION</h3>
      <p className="mb-2"><strong>7.1 Independent Contractor Status and Freedom to Practice.</strong> Nothing in this Agreement shall prohibit Contractor from independently practicing their profession, operating an independent business, or providing services to other individuals, companies, or organizations during or after the term of this Agreement, provided that such activities do not violate the provisions of this Article.</p>
      <p className="mb-2"><strong>7.2 Non-Solicitation of Platform Clients.</strong> Contractor acknowledges that clients introduced, referred, scheduled, or otherwise made available through the Company&apos;s Platform (&quot;Platform Clients&quot;) constitute valuable business relationships and proprietary interests of the Company. During the term of this Agreement and for a period of twelve (12) months thereafter, Contractor shall not, directly or indirectly:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>solicit, divert, entice, or attempt to solicit or divert any Platform Client away from the Company or the Platform;</li>
        <li>provide services to any Platform Client outside of the Company&apos;s approved Platform systems;</li>
        <li>accept direct payment from any Platform Client for services related to or arising from services introduced through the Platform; or</li>
        <li>facilitate, encourage, arrange, or participate in any off-platform relationship or arrangement intended to circumvent the Company&apos;s Platform, scheduling systems, payment systems, or business operations.</li>
      </ul>
      <p className="mb-2"><strong>7.3 Platform Integrity and Exclusive Platform Use.</strong> Contractor agrees that all services, communications, scheduling, documentation, recordkeeping, and payment processing relating to Platform Clients shall occur exclusively through the Company&apos;s approved Platform systems unless otherwise expressly authorized in writing by the Company. Contractor shall not communicate with Platform Clients outside of the Company&apos;s approved systems, including through personal telephone numbers, text messages, personal email accounts, social media platforms, or third-party applications, except where expressly authorized in writing by the Company. Contractor further acknowledges that all interactions with Platform Clients are subject to the Company&apos;s operational, confidentiality, HIPAA, and platform integrity requirements.</p>
      <p className="mb-2"><strong>7.4 Remedies for Breach.</strong> Contractor acknowledges that any violation of this Article may cause substantial and irreparable harm to the Company for which monetary damages alone may be inadequate. Accordingly, in the event of an actual or threatened breach, the Company shall be entitled to pursue any and all remedies available at law or in equity, including but not limited to:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>immediate suspension or termination of this Agreement;</li>
        <li>recovery of lost revenue, damages, fees, costs, or other losses arising from or related to the breach; and</li>
        <li>temporary, preliminary, and permanent injunctive or equitable relief to prevent or remedy further violations.</li>
      </ul>
      <p className="mb-2"><strong>7.5 Reasonableness.</strong> The parties acknowledge and agree that the restrictions contained in this Article are reasonable in scope, duration, and purpose, are intended solely to protect the Company&apos;s legitimate business interests and Platform integrity, and are not intended to restrict Contractor&apos;s general right to independently practice their profession or work with other organizations.</p>

      {/* ARTICLE 8 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 8 &ndash; INTELLECTUAL PROPERTY</h3>
      <p className="mb-2">All materials, records, documentation, data, work product, communications, analytics, and other information created or generated in connection with the Services or through the Company&apos;s approved systems shall be the exclusive property of the Company. Contractor shall have no ownership interest in such materials and shall not retain, disclose, copy, distribute, or use such materials outside the scope of authorized Services except as required by applicable law.</p>
      <p className="mb-2">Upon termination of this Agreement or upon Company request, Contractor shall promptly return or securely destroy all Company property, records, confidential information, and Protected Health Information in Contractor&apos;s possession or control, subject to applicable legal retention requirements.</p>

      {/* ARTICLE 9 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 9 &ndash; PROFESSIONAL LIABILITY INSURANCE</h3>
      <p className="mb-2"><strong>9.1 Professional Liability Insurance.</strong> Contractor shall maintain professional liability (malpractice) insurance throughout the term of this Agreement in accordance with Contractor classification as follows:</p>
      <p className="mb-1 ml-4"><strong>a. Speech-Language Pathologists (SLPs).</strong> Speech-Language Pathologists (&quot;SLPs&quot;) shall maintain professional liability insurance with minimum limits of:</p>
      <ul className="list-disc pl-10 mb-2 space-y-1">
        <li>One Million Dollars ($1,000,000.00) per occurrence; and</li>
        <li>Three Million Dollars ($3,000,000.00) aggregate.</li>
      </ul>
      <p className="mb-1 ml-4"><strong>b. Speech-Language Pathology Assistants (SLPAs).</strong> Speech-Language Pathology Assistants (SLPAs) shall maintain professional liability insurance with minimum limits of:</p>
      <ul className="list-disc pl-10 mb-2 space-y-1">
        <li>Five Hundred Thousand Dollars ($500,000.00) per occurrence; and</li>
        <li>One Million Five Hundred Thousand Dollars ($1,500,000.00) aggregate.</li>
      </ul>
      <p className="mb-2">Contractor shall provide proof of insurance coverage prior to commencing Services and upon each policy renewal. Contractor shall immediately notify the Company of any lapse, cancellation, reduction, restriction, non-renewal, or material modification of coverage.</p>
      <p className="mb-2">Failure to maintain the required coverage may result in suspension, restriction of Platform participation, or termination of this Agreement.</p>
      <p className="mb-2"><strong>9.2</strong> Contractor shall comply with insurance requirements set forth in Exhibit C (Insurance Requirements). The Company reserves the right to request proof of insurance at any time during the term of this Agreement. Failure to maintain required coverage or provide proof upon request may result in suspension or termination of this Agreement.</p>

      {/* ARTICLE 10 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 10 &ndash; INDEMNIFICATION</h3>
      <p className="mb-2"><strong>10.1 Contractor Indemnification Obligations.</strong> Contractor shall defend, indemnify, and hold harmless the Company, its affiliates, owners, managers, employees, agents, contractors, successors, and assigns (collectively, the &quot;Indemnified Parties&quot;) from and against any claims, liabilities, damages, losses, penalties, fines, costs, and expenses, including reasonable attorneys&apos; fees, arising out of or relating to:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>Contractor&apos;s negligence, misconduct, malpractice, or breach of professional duties;</li>
        <li>violations of this Agreement, Company policies, or applicable law;</li>
        <li>HIPAA violations, privacy breaches, unauthorized disclosures, or misuse of Protected Health Information (&quot;PHI&quot;);</li>
        <li>documentation failures, licensure violations, supervision failures, or regulatory violations;</li>
        <li>unauthorized use or misuse of Company systems, AI-assisted systems, technology platforms, or confidential information;</li>
        <li>platform misuse, billing misconduct, fraud, unauthorized client communications, or safeguarding violations;</li>
        <li>or any act or omission by Contractor or persons acting on Contractor&apos;s behalf in connection with the Services or Platform participation.</li>
      </ul>
      <p className="mb-2"><strong>10.2 Regulatory Compliance and Cooperation.</strong> Contractor remains solely responsible for complying with all applicable federal, state, and local laws, telehealth regulations, licensure requirements, supervision obligations, privacy laws, reimbursement requirements, and professional standards applicable within each Service Jurisdiction.</p>
      <p className="mb-2">Contractor shall cooperate with the Company in connection with any claim, investigation, audit, litigation, breach response, regulatory proceeding, or compliance review relating to matters covered under this Article.</p>
      <p className="mb-2">The Company reserves the right to control the defense, settlement, or resolution of any matter subject to indemnification.</p>
      <p className="mb-2"><strong>10.3 No Limitation of Remedies.</strong> The indemnification obligations under this Article are cumulative and shall not limit any other rights or remedies available to the Company under this Agreement or applicable law, including suspension, termination, injunctive relief, recovery of damages, or enforcement of Company policies.</p>
      <p className="mb-2"><strong>10.4 Survival.</strong> The obligations under this Article shall survive termination, suspension, expiration of this Agreement, or discontinuation of Services.</p>

      {/* ARTICLE 11 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 11 &ndash; TERM AND TERMINATION</h3>
      <p className="mb-2"><strong>11.1 At-Will Relationship and Standard Termination Notice.</strong> This Agreement is entered into on an at-will basis. Either party may terminate this Agreement at any time, with or without cause, upon fourteen (14) days&apos; prior written notice to the other party unless a different notice period is required by applicable law or agreed to in writing by the parties.</p>
      <p className="mb-2">The Company reserves the right to modify, limit, or discontinue Contractor&apos;s access to Clients, scheduling opportunities, Platform participation, or operational assignments during any notice period where deemed reasonably necessary to protect Clients, Platform operations, compliance obligations, or business interests.</p>
      <p className="mb-2"><strong>11.2 Immediate Termination or Suspension for Cause.</strong> The Company may immediately suspend, restrict, or terminate this Agreement, Platform access, or Contractor participation for cause, including but not limited to:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>material breach of this Agreement;</li>
        <li>licensure, insurance, or certification issues;</li>
        <li>HIPAA violations or unauthorized disclosures;</li>
        <li>documentation, supervision, or telehealth compliance failures;</li>
        <li>malpractice concerns, professional misconduct, fraud, or regulatory violations;</li>
        <li>platform misuse or unauthorized Client communications;</li>
        <li>safeguarding or child safety concerns;</li>
        <li>or any conduct that may endanger Clients, compromise PHI, violate applicable law, or materially harm the Company, its operations, or Platform integrity.</li>
      </ul>
      <p className="mb-2">The Company may also impose temporary restrictions, credential deactivation, or Client reassignment pending investigation of any alleged violation or safety concern.</p>
      <p className="mb-2"><strong>11.3 Contractor Obligations Upon Termination.</strong> Upon termination, suspension, or expiration of this Agreement, Contractor shall immediately:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>cease representing any affiliation with the Company;</li>
        <li>discontinue unauthorized access to Company systems and Platform Clients;</li>
        <li>cooperate with transition and offboarding procedures;</li>
        <li>return Company property and confidential information;</li>
        <li>and complete all outstanding documentation, records, and operational requirements relating to Services performed prior to termination.</li>
      </ul>
      <p className="mb-2">Failure to timely complete required documentation may result in delayed or forfeited compensation or other corrective action permitted under this Agreement or applicable law.</p>
      <p className="mb-2"><strong>11.4 Return, Destruction, and Protection of PHI.</strong> Upon termination or Company request, Contractor shall promptly return, securely destroy, or permanently delete all Protected Health Information (&quot;PHI&quot;), confidential information, Company data, recordings, documentation, and Company property in Contractor&apos;s possession or control, except to the extent retention is required under applicable law.</p>
      <p className="mb-2">Contractor shall not retain, access, copy, disclose, transmit, or use Company records, Client information, PHI, or confidential information following termination except as expressly authorized by the Company or required by law.</p>
      <p className="mb-2">All HIPAA obligations, confidentiality obligations, data-security requirements, and restrictions relating to PHI and confidential information shall survive termination of this Agreement.</p>
      <p className="mb-2"><strong>11.5 Post-Termination Platform Access Restrictions.</strong> Upon termination, suspension, or deactivation, the Company may immediately revoke or restrict Contractor&apos;s access to Company systems, telehealth platforms, scheduling systems, documentation systems, AI-assisted tools, Client records, and Company-issued accounts or credentials.</p>
      <p className="mb-2">Contractor shall not access, retain, copy, download, disclose, or use Company systems, Platform data, Client information, PHI, or confidential information following termination unless expressly authorized by the Company or required by law.</p>
      <p className="mb-2">The Company may retain and review operational records, communications, documentation, and Platform activity logs for legal, compliance, operational, or security purposes.</p>
      <p className="mb-2"><strong>11.6 Survival.</strong> Any provisions of this Agreement which by their nature should survive termination, including but not limited to confidentiality obligations, HIPAA obligations, indemnification obligations, non-solicitation obligations, documentation obligations, dispute resolution provisions, intellectual property protections, and post-termination restrictions, shall survive termination or expiration of this Agreement.</p>

      {/* ARTICLE 12 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 12 &ndash; GOVERNING LAW, TELEHEALTH COMPLIANCE, AND DISPUTE RESOLUTION</h3>
      <p className="mb-2"><strong>12.1 Multi-State Telehealth Compliance and Service Jurisdiction.</strong> The parties acknowledge that the Services contemplated under this Agreement are provided through a multi-state telehealth platform and may be rendered in multiple jurisdictions depending on the physical location of the Client at the time Services are performed. Contractor shall maintain all licenses, certifications, registrations, permits, and authorizations required to lawfully provide telehealth and speech-language therapy services in each jurisdiction where Services are rendered and where Clients are physically located at the time-of-service delivery. Contractors shall comply with all applicable federal, state, and local laws, regulations, professional standards, telehealth requirements, licensure rules, supervision requirements, privacy laws, reimbursement requirements, and scope-of-practice laws applicable within each Service Jurisdiction.</p>
      <p className="mb-2"><strong>12.2 Governing Law.</strong> Except as otherwise required by mandatory law within the applicable Service Jurisdiction, this Agreement shall be interpreted, governed, and enforced in accordance with the laws of the jurisdiction in which the Services giving rise to the dispute were rendered and where the applicable Client was physically located at the time such Services were provided (&quot;Service Jurisdiction&quot;). To the extent a dispute relates primarily to Company internal governance, business operations, administrative procedures, payment administration, platform administration, intellectual property, confidentiality obligations, or Company operational policies that are not specific to a particular Service Jurisdiction, the Company may elect the application of the laws of the State of Louisiana or another jurisdiction in which the Company is organized or principally operates.</p>
      <p className="mb-2"><strong>12.3 Venue and Jurisdiction.</strong> Any legal proceeding arising out of or relating to Services rendered under this Agreement shall be brought in a court of competent jurisdiction located within the applicable Service Jurisdiction or another jurisdiction permitted by applicable law. The parties consent to personal jurisdiction in such courts where legally permissible. The Company additionally reserves the right to pursue equitable or injunctive relief in any jurisdiction necessary to protect Platform operations, confidential information, intellectual property, Protected Health Information (PHI), or Company business interests.</p>
      <p className="mb-2"><strong>12.4 Arbitration Option.</strong> Notwithstanding the foregoing, the Company may elect, in its sole discretion and where permitted by applicable law, to require that any dispute arising under this Agreement be resolved through binding arbitration administered by a nationally recognized arbitration provider selected by the Company. Any such arbitration shall occur in a jurisdiction reasonably related to the dispute, the Contractor, the applicable Service Jurisdiction, or the Company&apos;s principal place of business, and shall be conducted in accordance with the applicable commercial arbitration rules of the selected arbitration provider. The arbitrator shall apply the substantive law applicable under this Article 12.</p>
      <p className="mb-2"><strong>12.5 Attorneys&apos; Fees and Equitable Relief.</strong> The prevailing party in any action or proceeding arising under this Agreement shall be entitled to recover reasonable attorneys&apos; fees, costs, and expenses to the extent permitted by applicable law. Nothing contained herein shall limit the Company&apos;s right to seek temporary, preliminary, or permanent injunctive or equitable relief in any court of competent jurisdiction to protect confidential information, Platform integrity, intellectual property, Protected Health Information (PHI), or compliance with applicable telehealth and healthcare laws.</p>

      {/* ARTICLE 13 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 13 &ndash; COMPLIANCE WITH LAWS</h3>
      <p className="mb-2">Contractors shall comply with all telehealth and licensure laws in applicable jurisdictions.</p>

      {/* ARTICLE 14 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 14 &ndash; PEDIATRIC SAFETY, BACKGROUND SCREENING, AND CHILD PROTECTION COMPLIANCE</h3>
      <p className="mb-2"><strong>14.1 Pediatric Service Delivery Acknowledgment.</strong> Contractor acknowledges that the Company may provide speech-language therapy and related telehealth services to pediatric Clients, including minors and other legally protected individuals, through the Company-approved Platform. Contractor further acknowledges that pediatric service delivery requires heightened professional responsibility, child safety protections, safeguarding obligations, supervision compliance, confidentiality protections, and compliance with all applicable federal, state, and local child protection laws, professional standards, and telehealth requirements applicable within each Service Jurisdiction.</p>
      <p className="mb-2"><strong>14.2 Background Check and Screening Requirements.</strong> The Company reserves the right to require Contractor to successfully complete background screening, credential verification, identity verification, professional license verification, sanction screening, exclusion screening, reference verification, and other compliance-related screening procedures prior to the commencement of Services and at any time during the term of this Agreement.</p>
      <p className="mb-1">Background screening requirements may include, but are not limited to:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>criminal background checks;</li>
        <li>sex offender registry searches;</li>
        <li>child abuse and neglect registry checks;</li>
        <li>identity verification;</li>
        <li>employment verification;</li>
        <li>education verification;</li>
        <li>professional license verification;</li>
        <li>healthcare exclusion database screening;</li>
        <li>Office of Inspector General (OIG) exclusion screening;</li>
        <li>National Practitioner Data Bank inquiries where applicable;</li>
        <li>and other screening procedures deemed appropriate by the Company.</li>
      </ul>
      <p className="mb-2">The Company reserves the right to determine the scope, frequency, timing, acceptability, and sufficiency of all screening procedures in its discretion and in accordance with applicable law.</p>
      <p className="mb-2"><strong>14.3 Pediatric-Facing Contractor Clearances.</strong> Contractors providing services to pediatric Clients may be required to maintain additional clearances, certifications, authorizations, screenings, or child safety documentation as required by:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>applicable federal law;</li>
        <li>state law;</li>
        <li>licensing board requirements;</li>
        <li>payer requirements;</li>
        <li>school-based service requirements;</li>
        <li>telehealth regulations;</li>
        <li>Company operational standards;</li>
        <li>or child protection laws applicable within the relevant Service Jurisdiction.</li>
      </ul>
      <p className="mb-1">Such additional pediatric-facing clearances may include, but are not limited to:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>fingerprint-based background clearances;</li>
        <li>child abuse clearances;</li>
        <li>school-system vendor clearances;</li>
        <li>pediatric safety certifications;</li>
        <li>mandatory reporter training;</li>
        <li>abuse prevention training;</li>
        <li>and other child protection-related compliance requirements.</li>
      </ul>
      <p className="mb-2">Contractor shall remain solely responsible for timely obtaining, maintaining, renewing, and complying with all required clearances and certifications applicable to pediatric service delivery.</p>
      <p className="mb-2"><strong>14.4 Child Safety and Mandatory Reporting Obligations.</strong> Contractor shall comply with all applicable child safety laws, safeguarding requirements, abuse prevention laws, mandatory reporting obligations, supervision requirements, confidentiality laws, and professional conduct standards applicable to pediatric service delivery.</p>
      <p className="mb-1">Contractor acknowledges and agrees that Contractor may be deemed a mandatory reporter under applicable law and shall comply with all legal obligations relating to:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>suspected child abuse;</li>
        <li>neglect;</li>
        <li>exploitation;</li>
        <li>endangerment;</li>
        <li>unsafe conditions;</li>
        <li>or other reportable conduct involving pediatric Clients.</li>
      </ul>
      <p className="mb-1">Contractor shall immediately notify the Company of any:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>reportable incident;</li>
        <li>governmental investigation;</li>
        <li>licensing complaint;</li>
        <li>child safety concern;</li>
        <li>arrest;</li>
        <li>criminal charge;</li>
        <li>loss of clearance;</li>
        <li>or other event that could impact Contractor&apos;s eligibility to provide pediatric services.</li>
      </ul>
      <p className="mb-2">Nothing in this Agreement shall be construed to limit Contractor&apos;s independent legal obligations under mandatory reporting laws.</p>
      <p className="mb-2"><strong>14.5 Professional Conduct and Pediatric Interaction Standards.</strong> Contractor shall maintain appropriate professional boundaries, ethical conduct, safeguarding practices, and clinically appropriate behavior in all interactions involving pediatric Clients and their families.</p>
      <p className="mb-1">Contractor shall not engage in:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>inappropriate communications;</li>
        <li>unauthorized off-platform interactions;</li>
        <li>unapproved recording of pediatric sessions;</li>
        <li>conduct inconsistent with child safety obligations;</li>
        <li>or any behavior prohibited under applicable law, Company policy, professional standards, or safeguarding requirements.</li>
      </ul>
      <p className="mb-2">All pediatric-related communications, scheduling, documentation, telehealth sessions, and Client interactions shall occur exclusively through Company-approved Platform systems unless otherwise authorized by the Company in writing.</p>
      <p className="mb-2"><strong>14.6 Ongoing Compliance and Company Rights.</strong> The Company reserves the right to:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>require updated screenings or clearances at any time;</li>
        <li>monitor compliance with pediatric safety requirements;</li>
        <li>restrict or prohibit Contractor from providing pediatric services;</li>
        <li>suspend Platform access;</li>
        <li>reassign pediatric Clients;</li>
        <li>require additional training;</li>
        <li>or terminate this Agreement.</li>
      </ul>
      <p className="mb-2">Where the Company reasonably determines that such action is necessary to protect pediatric Clients, maintain compliance, satisfy payer or regulatory requirements, or preserve Platform safety and operational integrity.</p>
      <p className="mb-2">Failure to comply with pediatric safety requirements, background screening obligations, mandatory reporting obligations, or child protection standards may result in immediate suspension, restriction of services, removal from pediatric assignments, compensation limitations, or immediate termination of this Agreement.</p>

      {/* ARTICLE 15 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 15 &ndash; TELEHEALTH SAFETY, EMERGENCY RESPONSE, AND CLIENT PROTECTION</h3>
      <p className="mb-2"><strong>15.1 Telehealth Safety Acknowledgment.</strong> Contractor acknowledges that Services under this Agreement are delivered through a multi-state telehealth platform and that telehealth services may present unique operational, clinical, technological, emergency-response, and client safety considerations.</p>
      <p className="mb-2">Contractor agrees to comply with all Company telehealth safety procedures, emergency-response protocols, crisis-management requirements, mandatory reporting obligations, and applicable federal, state, and local laws governing telehealth practice within each applicable Service Jurisdiction.</p>
      <p className="mb-2"><strong>15.2 Client Physical Location Verification.</strong> Contractor shall verify and document the Client&apos;s physical location at the time of each telehealth session to the extent required under applicable law, payer requirements, professional standards, Company policy, or clinical necessity.</p>
      <p className="mb-1">Contractor acknowledges that the Client&apos;s physical location at the time Services are rendered may determine:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>applicable licensure requirements;</li>
        <li>telehealth authorization requirements;</li>
        <li>emergency-response obligations;</li>
        <li>mandatory reporting obligations;</li>
        <li>jurisdiction-specific compliance requirements;</li>
        <li>and applicable standards of care.</li>
      </ul>
      <p className="mb-2">Where required by Company policy or applicable law, Contractor shall document the Client&apos;s current physical location within Company-approved Platform systems at the beginning of the session or as otherwise required.</p>
      <p className="mb-2">If Contractor determines that the Client is physically located within a jurisdiction where Contractor is not authorized or licensed to provide Services, Contractor shall immediately discontinue or refrain from providing Services unless otherwise permitted under applicable law or Company authorization procedures.</p>
      <p className="mb-2"><strong>15.3 Emergency Contact Documentation Requirements.</strong> Contractor shall comply with Company operational procedures regarding collection, verification, maintenance, and documentation of emergency contact information for Clients receiving telehealth services.</p>
      <p className="mb-2">Where applicable, Contractor shall ensure that available emergency contact information, caregiver information, guardian information, or emergency-response information is properly documented within Company-approved Platform systems in accordance with Company procedures and applicable law.</p>
      <p className="mb-2">Contractor shall promptly notify the Company of missing, incomplete, inaccurate, or unavailable emergency contact information where such information is required for telehealth service delivery or client safety purposes.</p>
      <p className="mb-2"><strong>15.4 Crisis Response and Emergency Procedures.</strong> Contractor shall comply with all Company crisis-response protocols, emergency procedures, escalation procedures, safeguarding requirements, and telehealth emergency-management policies applicable to the Services.</p>
      <p className="mb-1">Where Contractor reasonably determines that a Client may present:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>an imminent safety concern;</li>
        <li>risk of harm to self or others;</li>
        <li>abuse concerns;</li>
        <li>neglect concerns;</li>
        <li>medical emergencies;</li>
        <li>psychiatric emergencies;</li>
        <li>crisis situations;</li>
        <li>or other urgent safety-related conditions,</li>
      </ul>
      <p className="mb-1">Contractor shall take clinically appropriate action consistent with:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>applicable law;</li>
        <li>professional standards;</li>
        <li>Company policies;</li>
        <li>mandatory reporting obligations;</li>
        <li>and emergency-response procedures.</li>
      </ul>
      <p className="mb-1">Such actions may include:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>contacting emergency contacts;</li>
        <li>contacting emergency responders;</li>
        <li>initiating mandated reports;</li>
        <li>escalating concerns to the Company;</li>
        <li>coordinating with caregivers or guardians;</li>
        <li>or taking other clinically appropriate protective actions permitted under applicable law.</li>
      </ul>
      <p className="mb-2"><strong>15.5 Mandatory Reporting Compliance.</strong> Contractor shall comply with all mandatory reporting laws, abuse-reporting obligations, safeguarding requirements, and child-protection laws applicable within each Service Jurisdiction.</p>
      <p className="mb-1">Contractor acknowledges that Contractor may be considered a mandatory reporter under applicable law and shall independently remain responsible for complying with all legal reporting obligations relating to:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>suspected abuse;</li>
        <li>neglect;</li>
        <li>exploitation;</li>
        <li>endangerment;</li>
        <li>threats of harm;</li>
        <li>vulnerable-person concerns;</li>
        <li>or other reportable conduct.</li>
      </ul>
      <p className="mb-2">Contractor shall additionally comply with Company reporting procedures relating to reportable incidents, safety concerns, crisis events, or emergency situations involving Clients.</p>
      <p className="mb-2">Nothing contained in this Agreement shall limit Contractor&apos;s independent legal obligations under applicable mandatory reporting laws.</p>
      <p className="mb-2"><strong>15.6 Escalation Procedures for Safety Concerns.</strong> Contractor shall promptly escalate and report to the Company any:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>client safety concerns;</li>
        <li>emergency situations;</li>
        <li>crisis events;</li>
        <li>safeguarding concerns;</li>
        <li>suspected abuse or neglect;</li>
        <li>inappropriate caregiver conduct;</li>
        <li>technological failures impacting client safety;</li>
        <li>or other incidents requiring operational review or intervention.</li>
      </ul>
      <p className="mb-2">Contractor shall cooperate with Company investigations, documentation requests, compliance reviews, crisis-management procedures, and operational follow-up relating to safety-related events or emergency-response situations.</p>
      <p className="mb-2"><strong>15.7 Telehealth Environment and Safety Obligations.</strong> Contractor shall maintain a professional, safe, secure, and clinically appropriate telehealth environment when providing Services through the Platform.</p>
      <p className="mb-1">Contractor shall take reasonable steps to:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>protect Client confidentiality;</li>
        <li>minimize disruptions;</li>
        <li>maintain appropriate technological functionality;</li>
        <li>ensure clinically appropriate communication;</li>
        <li>and comply with Company telehealth operational standards and HIPAA requirements.</li>
      </ul>
      <p className="mb-2">Contractor shall not provide Services while impaired, distracted, operating a vehicle, or otherwise unable to safely and professionally perform Services.</p>
      <p className="mb-2"><strong>15.8 Company Operational Authority and Emergency Oversight.</strong> The Company reserves the right to:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>establish telehealth safety procedures;</li>
        <li>require crisis-management training;</li>
        <li>implement emergency-response protocols;</li>
        <li>monitor telehealth safety compliance;</li>
        <li>impose documentation requirements;</li>
        <li>restrict service delivery;</li>
        <li>suspend Platform access;</li>
        <li>require additional operational safeguards;</li>
        <li>or take any other action reasonably necessary to protect Clients, maintain regulatory compliance, preserve Platform integrity, or address safety-related concerns.</li>
      </ul>
      <p className="mb-2">Failure to comply with telehealth safety obligations, emergency-response procedures, mandatory reporting obligations, or crisis-management requirements may result in corrective action, operational restrictions, suspension of Platform participation, reassignment of Clients, compensation limitations, or immediate termination of this Agreement.</p>

      {/* ARTICLE 16 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 16 &ndash; AI ASSISTED DOCUMENTATION, TRANSCRIPTION, AND TECHNOLOGY COMPLIANCE</h3>
      <p className="mb-2"><strong>16.1 Company-approved Platform AI and Documentation Systems.</strong> Contractor acknowledges that the Company may utilize Company-approved Platform artificial intelligence (&quot;AI&quot;) systems, AI-assisted documentation technologies, multilingual transcription tools, automated note-generation systems, speech-recognition software, language-processing systems, translation tools, and other technology-assisted documentation platforms in connection with the Services and operation of the Platform.</p>
      <p className="mb-2">Contractor shall use only Company-approved Platform AI-assisted systems, documentation platforms, transcription systems, translation tools, and operational technologies authorized by the Company for use in connection with Company Services, Client interactions, documentation preparation, telehealth operations, scheduling, communications, or Protected Health Information (&quot;PHI&quot;).</p>
      <p className="mb-2"><strong>16.2 Prohibition on Unauthorized Third-Party AI Systems.</strong> Contractor shall not utilize, upload, disclose, transmit, process, record, store, generate, or input Company data, Client information, confidential information, session information, recordings, documentation, or Protected Health Information (&quot;PHI&quot;) into any unauthorized third-party artificial intelligence platform, transcription tool, recording application, documentation system, translation service, note-generation tool, chatbot system, cloud-based AI service, or other unauthorized technology platform.</p>
      <p className="mb-2">Unauthorized use of third-party AI systems, documentation systems, or transcription platforms involving Company information or Protected Health Information shall constitute a material violation of this Agreement and may result in immediate suspension or termination of Platform access and/or this Agreement.</p>
      <p className="mb-2"><strong>16.3 Contractor Clinical Responsibility and Documentation Review.</strong> Contractor acknowledges and agrees that any AI-assisted documentation, transcription output, automated note-generation content, translation output, or technology-assisted clinical documentation generated through Company-approved Platform systems is intended solely as a supplemental administrative or operational aid.</p>
      <p className="mb-1">Contractor shall remain solely and independently responsible for:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>reviewing all AI-assisted documentation;</li>
        <li>verifying the accuracy and completeness of documentation;</li>
        <li>correcting errors or inaccuracies;</li>
        <li>validating clinical appropriateness;</li>
        <li>ensuring compliance with applicable standards of care;</li>
        <li>and ensuring that all finalized documentation accurately reflects the Services provided.</li>
      </ul>
      <p className="mb-2">Contractor shall not rely exclusively on AI-generated documentation or transcription output without independent professional review and clinical validation.</p>
      <p className="mb-2">The use of AI-assisted systems shall not reduce, transfer, replace, or limit Contractor&apos;s independent professional judgment, documentation obligations, supervision responsibilities, legal obligations, or clinical accountability.</p>
      <p className="mb-2"><strong>16.4 HIPAA, Confidentiality, and PHI Protection Requirements.</strong> All Company-approved Platform AI-assisted systems, transcription technologies, multilingual documentation tools, and technology-assisted operational systems shall remain subject to all applicable:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>HIPAA requirements;</li>
        <li>privacy laws;</li>
        <li>confidentiality obligations;</li>
        <li>data-security requirements;</li>
        <li>telehealth regulations;</li>
        <li>Business Associate Agreement obligations;</li>
        <li>and Company operational standards governing Protected Health Information (&quot;PHI&quot;) and confidential information.</li>
      </ul>
      <p className="mb-2">Contractor shall comply with all Company operational safeguards, security procedures, access controls, authentication requirements, confidentiality standards, and data-protection requirements relating to Company-approved Platform AI and documentation systems.</p>
      <p className="mb-1">Contractor acknowledges that PHI protections apply equally to:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>AI-assisted systems;</li>
        <li>automated documentation platforms;</li>
        <li>transcription technologies;</li>
        <li>translation systems;</li>
        <li>speech-recognition systems;</li>
        <li>and all other Company-approved Platform technology-assisted operational tools.</li>
      </ul>
      <p className="mb-2"><strong>16.5 Recording, Storage, and Data Handling Restrictions.</strong> Contractor shall not independently create, retain, download, store, transfer, export, duplicate, record, or maintain copies of:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>AI-generated documentation;</li>
        <li>session recordings;</li>
        <li>transcription outputs;</li>
        <li>translated documentation;</li>
        <li>Client communications;</li>
        <li>or other Company data</li>
      </ul>
      <p className="mb-2">outside of Company-approved Platform systems unless expressly authorized in writing by the Company and permitted under applicable law.</p>
      <p className="mb-2">Any storage, handling, retention, or transmission of documentation or recordings outside Company-approved Platform systems is strictly prohibited unless specifically authorized by the Company.</p>
      <p className="mb-2"><strong>16.6 Company Operational Authority and Technology Governance.</strong> The Company reserves the right to:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>approve or prohibit AI systems and documentation technologies;</li>
        <li>modify authorized technology platforms;</li>
        <li>impose technology usage requirements;</li>
        <li>monitor compliance with AI-related operational standards;</li>
        <li>audit documentation practices;</li>
        <li>restrict system access;</li>
        <li>suspend use of technology tools;</li>
        <li>require training relating to AI-assisted systems;</li>
        <li>or implement additional safeguards deemed necessary to protect Clients, PHI, operational integrity, or legal compliance.</li>
      </ul>
      <p className="mb-2">Contractor shall cooperate with all Company technology compliance procedures, documentation audits, operational reviews, and security investigations relating to AI-assisted systems or technology usage.</p>
      <p className="mb-2">Failure to comply with Company AI policies, confidentiality requirements, HIPAA obligations, technology restrictions, or documentation review responsibilities may result in corrective action, operational restrictions, suspension of Platform participation, compensation limitations, revocation of system access, or immediate termination of this Agreement.</p>

      {/* ARTICLE 17 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 17 &ndash; PLATFORM USE AND DATA SECURITY</h3>
      <p className="mb-2"><strong>17.1 Approved Platform Use.</strong> Contractors shall use only Company-approved Platform systems, platforms, applications, and technology for all services performed under this Agreement, including but not limited to communications, scheduling, documentation, recordkeeping, telehealth sessions, and payment processing relating to Platform Clients. Approved systems include the Company&apos;s website, mobile application, and any associated software or digital systems authorized by the Company.</p>
      <p className="mb-2"><strong>17.2 Ownership of Platform Data and Records.</strong> All client-related records, documentation, communications, session data, therapy notes, evaluations, treatment plans, platform-generated records, analytics, and other materials created or maintained through Company-approved Platform systems shall remain subject to Article 8 of this Agreement. Contractor shall not retain, disclose, distribute, or use such materials outside the scope of authorized Services except as permitted by applicable law or expressly authorized in writing by the Company.</p>
      <p className="mb-2"><strong>17.3 Prohibited External Communications.</strong> Unless expressly authorized in writing by the Company, Contractor shall not communicate with Platform Clients through personal phone numbers, personal email accounts, text messaging, social media platforms, third-party applications, or any unauthorized communication systems. All client-related communications shall occur exclusively through Company-approved Platform systems.</p>
      <p className="mb-2"><strong>17.4 Data Security and HIPAA Compliance.</strong> Contractors shall comply with all applicable privacy, confidentiality, data security, and HIPAA requirements and shall implement reasonable administrative, technical, and physical safeguards to protect Protected Health Information (PHI), confidential information, and Company data from unauthorized access, use, disclosure, alteration, or transmission.</p>
      <p className="mb-2"><strong>17.5 Application Across Company Systems.</strong> The operational, confidentiality, HIPAA, documentation, platform integrity, and data security obligations under this Agreement shall apply to all Company-approved Platform systems, platforms, applications, and digital environments utilized in connection with the Services.</p>
      <p className="mb-2"><strong>17.6 Restriction of Platform Access and Credential Deactivation.</strong> The Company reserves the right to immediately restrict, suspend, deactivate, or terminate Contractor&apos;s access to the Platform, associated accounts, credentials, systems, or applications where the Company reasonably determines that such action is necessary to protect clients, Protected Health Information (PHI), Company data, operational integrity, or compliance with applicable law and Company standards. Such action may be taken in connection with actual or suspected documentation failures, client complaints, HIPAA or privacy concerns, ethical violations, clinical deficiencies, platform misuse, unauthorized communications, security concerns, or other violations of this Agreement or Company policies.</p>
      <p className="mb-2"><strong>17.7 Temporary Suspension Pending Investigation.</strong> The Company may temporarily suspend Contractor&apos;s access to the Platform and related systems pending investigation of any alleged misconduct, policy violation, legal or regulatory concern, security incident, or client-related complaint. During any period of suspension, Contractor shall immediately cease access to Company systems and shall cooperate with any reasonable Company investigation or compliance review.</p>
      <p className="mb-2"><strong>17.8 Unauthorized Systems and Security Violations.</strong> Contractors shall not use unauthorized systems, software, applications, recording tools, storage methods, or communication channels in connection with Platform Clients or Company operations. Any unauthorized use, disclosure, retention, or transmission of Company data or Protected Health Information may result in suspension or termination of platform access and/or this Agreement, in addition to any other remedies available under applicable law or this Agreement.</p>

      {/* ARTICLE 18 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 18 &ndash; AUDIT AND CLASSIFICATION PROTECTION</h3>
      <p className="mb-2">Contractor acknowledges and agrees that Contractor is engaged as an independent contractor and retains the right to provide services for other businesses, maintain an independent practice, and determine the manner and means of performing Services, subject only to the requirements of this Agreement. Nothing in this Agreement shall be construed to create exclusivity, an employment relationship, or entitlement to employee benefits.</p>

      {/* ARTICLE 19 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 19 &ndash; RIGHT TO MODIFY AGREEMENT</h3>
      <p className="mb-2"><strong>19.1 Company Right to Modify.</strong> The Company reserves the right to amend, modify, or update the terms of this Agreement, including operational requirements, platform procedures, policies, compliance standards, and administrative processes, upon reasonable prior written notice to Contractor. Compensation modifications shall be governed by Article 4.4.</p>
      <p className="mb-2"><strong>19.2 Continued Engagement.</strong> Contractor&apos;s continued provision of Services following the effective date of any modification issued in accordance with this Article 19 shall constitute acceptance of the updated terms. If Contractor does not agree to a material modification, Contractor may discontinue providing Services in accordance with the termination provisions of this Agreement prior to the effective date of such modification.</p>

      {/* ARTICLE 20 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 20 &ndash; NOTICE</h3>
      <p className="mb-2"><strong>20.1 Method of Notice.</strong> Any notice required under this Agreement shall be in writing and delivered by email or certified mail to the addresses designated below, or to such other address or email address as either party may subsequently designate in writing:</p>
      <div className="mb-3 ml-4">
        <p className="font-semibold text-black">Company:</p>
        <p>ROOTED VOICES SPEECH &amp; LANGUAGE THERAPY, LLC</p>
        <p>Mailing Address: 10765 Clocktower Dr., La Grange Highlands, IL 60525</p>
        <p>Email Address: admin@rootedvoicestherapy.com</p>
      </div>
      <div className="mb-3 ml-4">
        <p className="font-semibold text-black">Contractor:</p>
        <p>Mailing Address: <FilledField value={s?.contractorAddress} /></p>
        <p>Email Address: <FilledField value={s?.contractorEmail} /></p>
      </div>
      <p className="mb-2">Notice delivered by email shall be deemed effective upon confirmation of transmission, provided that no delivery failure or rejection notice is received. Notice delivered by certified mail shall be deemed effective upon confirmed delivery or refusal.</p>
      <p className="mb-2"><strong>20.2 Timing of Notice.</strong> Unless otherwise specified, a minimum of fourteen (14) days&apos; prior written notice shall be provided for any material changes to this Agreement.</p>

      {/* ARTICLE 21 */}
      <h3 className="text-lg font-bold text-black mt-6 mb-2">ARTICLE 21 &ndash; EXHIBITS</h3>
      <p className="mb-2">The following Exhibits are incorporated into and made a part of this Agreement by reference and shall have the same force and effect as if fully set forth herein:</p>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>Exhibit A &ndash; Scope of Services</li>
        <li>Exhibit B &ndash; Compensation Schedule</li>
        <li>Exhibit C &ndash; Insurance Requirements</li>
        <li>Exhibit D &ndash; HIPAA / Business Associate Agreement</li>
      </ul>

      {/* EXHIBIT A */}
      <h3 className="text-lg font-bold text-black mt-8 mb-2 border-t-2 border-black pt-6">EXHIBIT A &ndash; SCOPE OF SERVICES</h3>
      <p className="mb-2 italic">Exhibit A outlines the scope of services to be performed by Contractor.</p>

      <p className="mb-2"><strong>1. Platform Care Delivery Model and Services Provided.</strong> The Company operates a multi-state telehealth speech-language therapy platform utilizing an evaluation-first care model designed to support clinically appropriate treatment planning, continuity of care, service matching, operational efficiency, and compliance with applicable telehealth and licensure requirements.</p>
      <p className="mb-2">Except where otherwise approved by the Company or clinically inappropriate under applicable law, Clients shall generally be required to complete an initial evaluation prior to the initiation of ongoing therapy services. Initial evaluations are intended to assess Client needs, determine clinical appropriateness, establish treatment recommendations, and identify the most appropriate service structure available through the Platform.</p>
      <p className="mb-2">Contractors shall provide speech-language therapy services via telehealth, including but not limited to evaluations, assessments, treatment planning, therapy sessions, progress monitoring, consultations, discharge planning, recurring care services, and other Company-approved Platform speech-language therapy services delivered through the Platform.</p>
      <p className="mb-2 ml-4"><strong>(a)</strong> Speech-Language Pathologists (SLPs) may evaluate, diagnose, and treat Clients independently and shall be responsible for clinical decision-making in accordance with applicable standards of care. SLPs shall perform evaluations, develop treatment plans, provide therapy, conduct re-evaluations, complete discharge planning, and provide other clinically appropriate services permitted under applicable law.</p>
      <p className="mb-2 ml-4">SLPs may provide services through the Company&apos;s recurring subscription services, enhanced subscription service models, pay-as-you-go services, evaluations, consultations, and other Company-approved Platform operational care structures.</p>
      <p className="mb-2 ml-4"><strong>(b)</strong> Speech-Language Pathology Assistants (SLPAs) shall provide services only under the supervision of a licensed SLP, may not independently evaluate or diagnose Clients, and shall follow the direction and clinical oversight of the supervising SLP at all times.</p>
      <p className="mb-2 ml-4">SLPAs shall be limited to therapy implementation and related support services permitted under applicable law and shall practice strictly within the scope authorized by the applicable Service Jurisdiction and supervising SLP oversight requirement.</p>
      <p className="mb-2 ml-4"><strong>(c)</strong> Supervising SLP Responsibilities and Oversight. Supervising SLPs shall remain responsible for clinical oversight, delegated treatment supervision, documentation review, treatment direction, and supervision compliance required under applicable law and Company policy.</p>
      <p className="mb-2 ml-4"><strong>(d)</strong> State-Specific Supervision Compliance. Contractor acknowledges that supervision requirements applicable to SLPA services may vary by jurisdiction and both the Supervising SLP and SLPA remain solely responsible for compliance with all applicable supervision standards.</p>
      <p className="mb-2 ml-4"><strong>(e)</strong> Documentation Review and Supervisory Documentation Requirements. Supervising SLPs shall review and oversee SLPA documentation as required under applicable law, payer requirements, Company policy, and professional standards.</p>

      <p className="mb-2"><strong>2. General Operational Standards and Incorporation of Agreement Requirements.</strong> Contractor acknowledges and agrees that all Services performed under this Agreement shall be subject to, and governed by, the applicable provisions of this Agreement, including but not limited to requirements relating to professional licensure, supervision, documentation, telehealth compliance, HIPAA compliance, confidentiality, data security, platform usage, pediatric safety, emergency-response procedures, AI-assisted documentation, quality assurance standards, operational policies, safeguarding obligations, and all other applicable Company requirements.</p>
      <p className="mb-2">Contractors shall perform all Services in accordance with applicable federal, state, and local laws, professional standards, Company policies, and the operational requirements established by the Company from time to time.</p>
      <p className="mb-2">All obligations, requirements, restrictions, responsibilities, standards, and compliance requirements contained elsewhere in this Agreement are incorporated into this Exhibit A by reference as though fully set forth herein.</p>

      <p className="mb-2"><strong>3. Rooted Subscription Services.</strong> The Company may offer recurring therapy services under the &quot;Rooted&quot; subscription service model. Rooted services are designed to provide structured recurring therapy support, continuity of care, ongoing treatment progression, recurring scheduling, and ongoing clinical engagement through the Company-approved Platform.</p>
      <p className="mb-2">Contractors providing services under the Rooted service model shall comply with Company scheduling procedures, recurring care expectations, documentation requirements, operational workflows, continuity-of-care standards, and platform participation requirements.</p>

      <p className="mb-2"><strong>4. Flourish Subscription Services.</strong> The Company may additionally offer enhanced recurring therapy services under the &quot;Flourish&quot; subscription service model. Flourish services may include increased service frequency, expanded clinical support, enhanced care coordination, additional therapy engagement opportunities, or other enhanced service structures established by the Company.</p>
      <p className="mb-2">Contractors participating in Flourish services shall comply with all Company operational procedures, scheduling standards, supervision requirements (where applicable), documentation obligations, quality assurance standards, and recurring care expectations associated with enhanced subscription-based care delivery.</p>

      <p className="mb-2"><strong>5. Bloom Pay-As-You-Go Services.</strong> The Company may offer flexible individual-session or limited-engagement therapy services under the &quot;Bloom&quot; pay-as-you-go service model. Bloom services are designed to provide flexible therapy access for Clients seeking individual sessions, consultations, follow-up care, screenings, limited-duration support, or other Company-approved Platform services without recurring subscription enrollment.</p>
      <p className="mb-2">Services delivered under the Bloom service model shall remain subject to all Company operational procedures, documentation standards, scheduling requirements, telehealth compliance requirements, platform rules, and applicable clinical standards.</p>

      {/* EXHIBIT B */}
      <h3 className="text-lg font-bold text-black mt-8 mb-2 border-t-2 border-black pt-6">EXHIBIT B &ndash; COMPENSATION SCHEDULE</h3>

      <p className="mb-2"><strong>1.</strong> The Contractor acknowledges and agrees that compensation under this Agreement is performance-based, documentation-dependent, and operationally tied to Company compliance standards, platform requirements, and ongoing quality expectations. Compensation progression opportunities are earned and are not guaranteed, automatic, vested, fixed, or permanent.</p>
      <p className="mb-2">The Company reserves the right to establish, modify, interpret, or adjust compensation tiers, review criteria, operational requirements, and compensation qualification standards upon reasonable prior written notice to Contractor.</p>
      <p className="mb-2">Contractor compensation under this Agreement applies to services performed through the Company&apos;s Rooted, Flourish, and Bloom service models, as well as evaluations, consultations, and other Company-approved Platform care delivery structures.</p>

      <p className="mb-2"><strong>1.1 Definition of Qualifying Service Hours.</strong> For purposes of compensation, advancement reviews, and performance assessments under this Agreement, a &quot;Qualifying Service Hour&quot; means one (1) completed hour of direct client-related professional services properly performed through the Company-approved Platform and documented in compliance with Company requirements.</p>
      <p className="mb-2">Qualifying Service Hours shall be prorated based upon the actual duration of completed and billable Services. For example, a completed thirty (30)-minute billable session shall constitute 0.5 Qualifying Service Hours, and other completed partial-hour billable Services shall be calculated proportionately based upon the actual duration of the Service.</p>
      <p className="mb-1">Qualifying Service Hours may include:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>Completed speech-language therapy sessions;</li>
        <li>Completed evaluations and re-evaluations performed by licensed Speech-Language Pathologists (SLPs);</li>
        <li>Completed consultations authorized by the Company;</li>
        <li>Services performed through the Rooted, Flourish, and Bloom service models; and</li>
        <li>Other Company-approved billable clinical services performed through the Platform.</li>
      </ul>
      <p className="mb-1">The following shall not constitute Qualifying Service Hours unless otherwise expressly approved in writing by the Company:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>Cancelled appointments;</li>
        <li>Client no-show sessions;</li>
        <li>Administrative activities, Internal meetings, or Training;</li>
        <li>Documentation completed without a corresponding billable service;</li>
        <li>Corrective work arising from documentation deficiencies; or</li>
        <li>Any other non-billable activities designated by the Company.</li>
      </ul>
      <p className="mb-2">Qualifying Service Hours shall be calculated based upon completed and properly documented services recorded within Company-approved Platform systems. The Company reserves the right to review, audit, verify, adjust, reject, or recalculate reported Qualifying Service Hours where documentation deficiencies, compliance concerns, or other inaccuracies are identified.</p>

      <p className="mb-2"><strong>1.2 Quarterly Compensation Review Structure.</strong> The Company shall conduct compensation advancement reviews on a quarterly basis. A Contractor&apos;s first quarterly compensation review shall become eligible to occur after the Contractor has completed their first full calendar quarter of active platform participation following their onboarding effective date.</p>
      <p className="mb-2">Subsequent reviews shall occur on a quarterly basis thereafter, subject to the Company scheduling, operational needs, and the satisfaction of applicable advancement criteria.</p>
      <p className="mb-2">Completion of a full calendar quarter does not automatically guarantee a compensation increase. Advancement eligibility requires satisfaction of the criteria set forth in this Exhibit B and remains subject to Company discretion.</p>

      <p className="mb-2"><strong>1.3 Compensation Advancement Criteria.</strong> To be considered for a compensation advancement during a quarterly review, a Contractor should generally demonstrate all of the following during the review period:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li><strong>Active Platform Participation:</strong> Contractor maintained an average of at least five (5) Qualifying Service Hours per week during the applicable quarter, reflecting active and consistent caseload engagement through the Platform;</li>
        <li><strong>Documentation Compliance:</strong> Contractor maintained a documentation completion rate of ninety-five percent (95%) or greater;</li>
        <li><strong>Attendance and Session Reliability:</strong> Contractor maintained a scheduled session completion rate of ninety-five percent (95%) or greater;</li>
        <li><strong>Supervision Compliance (SLPAs):</strong> Contractor maintained full compliance with all applicable supervision requirements and supervisory documentation obligations (where applicable);</li>
        <li><strong>Licensure and Insurance Compliance:</strong> Contractor maintained all required licensure, certifications, and professional liability insurance throughout the review period;</li>
        <li><strong>No Unresolved Compliance Concerns:</strong> Contractor had no unresolved compliance, disciplinary, quality assurance, or platform integrity concerns during the review period; and</li>
        <li><strong>Overall Platform Contribution:</strong> Contractor demonstrated consistent professionalism, client continuity, responsiveness to Company operational requirements, and contribution to Platform quality and growth.</li>
      </ul>
      <p className="mb-2">The active platform participation threshold referenced above is intended solely as an indicator of meaningful caseload engagement and is not a minimum weekly schedule requirement. Nothing contained herein shall be construed to require Contractor to maintain any specific minimum schedule, workload, or availability commitment beyond those voluntarily selected by Contractor consistent with Contractor&apos;s independent contractor status.</p>
      <p className="mb-2">Advancement decisions remain discretionary and shall be determined solely by the Company based upon the totality of Contractor performance, operational needs, Platform demands, quality standards, and business considerations. Nothing contained herein shall be construed as creating a guaranteed right to any compensation increase.</p>

      <p className="mb-2"><strong>2. Fully Licensed Speech-Language Pathologist (SLP) Compensation Structure.</strong></p>
      <p className="mb-2 ml-4"><strong>2.1 Starting Compensation Rate.</strong> Fully Licensed Speech-Language Pathologists (&quot;SLPs&quot;) shall begin at a starting compensation rate of forty-five dollars (<strong>$45.00</strong>) per Qualifying Service Hour.</p>
      <p className="mb-2 ml-4"><strong>2.2 Productivity-Based Compensation Progression.</strong> SLPs may become eligible for compensation increases in five-dollar (<strong>$5.00</strong>) increments per Qualifying Service Hour following each quarterly review in which the applicable advancement criteria set forth in Section 1.3 are satisfied.</p>
      <p className="mb-2 ml-4">Advancement consideration does not create a guaranteed right to any compensation increase. Each advancement decision remains subject to Company discretion, operational needs, and continued compliance with all Company requirements.</p>
      <p className="mb-2 ml-4"><strong>2.3 Maximum Compensation Eligibility.</strong> SLPs may become eligible to progress to a maximum compensation rate of seventy-five dollars (<strong>$75.00</strong>) per Qualifying Service Hour. Eligibility for higher compensation tiers requires sustained performance, documentation compliance, quality assurance, and continued platform engagement consistent with the criteria set forth in this Exhibit B.</p>
      <p className="mb-2 ml-4"><strong>2.4 Evaluation Compensation.</strong> Evaluation services completed by a licensed SLP shall be compensated at the Contractor&apos;s then-current hourly compensation rate applicable at the time the evaluation services are performed. Evaluation services shall constitute Qualifying Service Hours under this Agreement and shall be compensated in the same manner as other qualifying billable clinical services unless otherwise provided by the Company.</p>
      <p className="mb-2 ml-4">The Company does not currently maintain a separate evaluation compensation schedule. Notwithstanding the foregoing, the Company reserves the right, in its sole discretion, to establish, modify, or implement a separate evaluation compensation structure, rate schedule, or methodology upon reasonable prior written notice to Contractor. Any such modification shall apply prospectively only and shall not affect compensation earned for evaluation services completed prior to the effective date of such modification.</p>

      <p className="mb-2"><strong>3. Speech-Language Pathology Assistant (SLPA) Compensation Structure.</strong></p>
      <p className="mb-2 ml-4"><strong>3.1 Starting Compensation Rate.</strong> Speech-Language Pathology Assistants (&quot;SLPAs&quot;) shall begin at a starting compensation rate of thirty dollars (<strong>$30.00</strong>) per Qualifying Service Hour.</p>
      <p className="mb-2 ml-4"><strong>3.2 Productivity-Based Compensation Progression.</strong> SLPAs may become eligible for compensation increases in five-dollar (<strong>$5.00</strong>) increments per Qualifying Service Hour following each quarterly review in which the applicable advancement criteria set forth in Section 1.3 are satisfied, including full compliance with all applicable supervision requirements.</p>
      <p className="mb-2 ml-4">Advancement consideration does not create a guaranteed right to any compensation increase. Each advancement decision remains subject to the Company&apos;s discretion, supervision, compliance, operational needs, and continued compliance with all Company requirements.</p>
      <p className="mb-2 ml-4"><strong>3.3 Maximum Compensation Eligibility.</strong> SLPAs may become eligible to progress to a maximum compensation rate of fifty-five dollars (<strong>$55.00</strong>) per Qualifying Service Hour. Eligibility for higher compensation tiers requires sustained supervision compliance, documentation compliance, quality assurance, and continued platform engagement consistent with the criteria set forth in this Exhibit B.</p>

      <p className="mb-2"><strong>4. Biweekly Payment Cycle.</strong> Payments shall be issued on a biweekly basis in accordance with the Company-established payroll cycles and payment processing schedules. Compensation shall apply only to completed sessions, properly documented Qualifying Service Hours, and services performed in compliance with Company operational standards and Platform requirements.</p>
      <p className="mb-2">The Company reserves the right to delay, withhold, adjust, offset, or deny compensation where documentation deficiencies, compliance concerns, billing discrepancies, operational violations, platform misuse, supervision deficiencies, or policy violations exist.</p>

      <p className="mb-2"><strong>5. Cancellation and No-Show Compensation.</strong></p>
      <p className="mb-2 ml-4"><strong>5.1 SLP Cancellation Compensation.</strong> A Fully Licensed Speech-Language Pathologist (SLP) may receive a flat-rate cancellation or no-show payment of twenty dollars (<strong>$20.00</strong>) for a qualifying cancelled, missed, or no-show session.</p>
      <p className="mb-2 ml-4"><strong>5.2 SLPA Cancellation Compensation.</strong> A Speech-Language Pathology Assistant (SLPA) may receive a flat-rate cancellation or no-show payment of fifteen dollars (<strong>$15.00</strong>) for a qualifying cancelled, missed, or no-show session.</p>
      <p className="mb-1 ml-4"><strong>5.3 Conditions for Eligibility.</strong> Cancellation or no-show compensation shall only apply where all of the following conditions are satisfied:</p>
      <ul className="list-disc pl-10 mb-2 space-y-1">
        <li>The session was properly scheduled through the Company-approved Platform;</li>
        <li>Contractor was present, available, prepared, and capable of rendering Services at the scheduled session time;</li>
        <li>All required documentation was timely completed;</li>
        <li>Contractor complied with all Company operational standards, supervision requirements, policies, and procedures; and</li>
        <li>The cancellation or no-show event was properly documented within Company-approved Platform systems in accordance with Company requirements.</li>
      </ul>
      <p className="mb-2 ml-4">Failure to properly document a cancellation, missed session, or no-show event may result in forfeiture or denial of cancellation compensation. All cancellation and no-show compensation remains subject to Company review, verification, and compliance audit.</p>

      <p className="mb-2"><strong>6. Incentives, Bonuses, and Compensation Modifications.</strong> The Company may, in its discretion, offer incentives, bonuses, productivity programs, or supplemental compensation opportunities based upon productivity, operational performance, quality assurance, documentation compliance, client retention, scheduling reliability, or other Company-established criteria.</p>
      <p className="mb-2">The Company reserves the right to modify compensation structures, incentive programs, rate schedules, or compensation qualification criteria upon reasonable prior written notice. Any such modification shall apply prospectively only and shall not retroactively affect compensation previously earned for completed Services.</p>

      {/* EXHIBIT C */}
      <h3 className="text-lg font-bold text-black mt-8 mb-2 border-t-2 border-black pt-6">EXHIBIT C &ndash; INSURANCE REQUIREMENTS</h3>
      <p className="mb-2"><strong>1. Professional Liability Insurance.</strong> Contractor shall maintain professional liability (malpractice) insurance throughout the term of this Agreement as follows:</p>
      <p className="mb-1 ml-4"><strong>a. Speech-Language Pathologists (SLPs):</strong></p>
      <ul className="list-disc pl-10 mb-2 space-y-1">
        <li>$1,000,000 per occurrence</li>
        <li>$3,000,000 aggregate</li>
      </ul>
      <p className="mb-1 ml-4"><strong>b. Speech-Language Pathology Assistants (SLPAs):</strong></p>
      <ul className="list-disc pl-10 mb-2 space-y-1">
        <li>$500,000 per occurrence</li>
        <li>$1,500,000 aggregate</li>
      </ul>
      <p className="mb-2">Such coverage levels reflect the differing levels of clinical responsibility and risk exposure, with SLPs maintaining primary diagnostic and treatment authority, and SLPAs operating under supervision.</p>
      <p className="mb-2"><strong>2. Proof of Coverage.</strong> Contractor shall provide proof of insurance coverage prior to commencing Services and upon each renewal of coverage.</p>
      <p className="mb-2"><strong>3. Additional Coverage.</strong> Contractor shall maintain any additional insurance required by applicable law, licensure requirements, or professional regulations applicable to Contractor&apos;s scope of practice.</p>
      <p className="mb-2"><strong>4. Failure to Maintain Coverage.</strong> Failure to maintain required coverage, provide proof of coverage, or comply with this Exhibit may result in suspension, restriction of Platform participation, or termination of this Agreement.</p>

      {/* EXHIBIT D */}
      <h3 className="text-lg font-bold text-black mt-8 mb-2 border-t-2 border-black pt-6">EXHIBIT D &ndash; HIPAA / BUSINESS ASSOCIATE ADDENDUM</h3>
      <p className="mb-2">This Business Associate Agreement (&quot;BAA&quot;) is incorporated into and made a part of the Independent Contractor Agreement (&quot;Agreement&quot;) between ROOTED VOICES SPEECH &amp; LANGUAGE THERAPY, LLC (&quot;Company&quot;) and Contractor. This BAA constitutes the complete Business Associate Agreement between the Company and Contractor with respect to the Services and Protected Health Information (&quot;PHI&quot;) covered by the Agreement, unless otherwise required by applicable law or expressly agreed to in writing by the parties.</p>
      <p className="mb-2">This BAA is entered into pursuant to the Health Insurance Portability and Accountability Act of 1996 (&quot;HIPAA&quot;), including the Privacy Rule, Security Rule, and Breach Notification Rule (45 CFR Parts 160 and 164).</p>
      <p className="mb-2"><strong>1. Definitions.</strong> Terms used in this Addendum shall have the meanings set forth in HIPAA, including but not limited to Protected Health Information (PHI), Breach, and Security Incident.</p>
      <p className="mb-2"><strong>2. Permitted Uses and Disclosures.</strong> Contractor may use or disclose PHI solely to perform obligations under this Agreement and as permitted by HIPAA.</p>
      <p className="mb-2"><strong>3. Prohibited Uses.</strong> Contractor shall not:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>Use PHI for personal or unauthorized purposes;</li>
        <li>Sell or improperly disclose PHI.</li>
      </ul>
      <p className="mb-2"><strong>4. Safeguards.</strong> Contractor shall implement administrative, technical, and physical safeguards, including:</p>
      <ul className="list-disc pl-6 mb-2 space-y-1">
        <li>Encrypted communications;</li>
        <li>Secure login credentials;</li>
        <li>Device-level protections.</li>
      </ul>
      <p className="mb-2"><strong>5. Minimum Necessary Standard.</strong> Contractor shall limit PHI use to the minimum necessary to perform services.</p>
      <p className="mb-2"><strong>6. Breach Notification.</strong> Contractor shall report any breach or unauthorized disclosure to Company within forty-eight (48) hours of discovery.</p>
      <p className="mb-2"><strong>7. Mitigation.</strong> Contractors shall take immediate steps to mitigate any harmful effects of a breach.</p>
      <p className="mb-2"><strong>8. Subcontractors.</strong> Contractor shall ensure that any subcontractor agrees in writing to comply with HIPAA obligations.</p>
      <p className="mb-2"><strong>9. Access and Amendment.</strong> Contractor shall provide access to PHI as required under HIPAA.</p>
      <p className="mb-2"><strong>10. Accounting of Disclosures.</strong> Contractor shall maintain records of PHI disclosures.</p>
      <p className="mb-2"><strong>11. Return or Destruction of PHI.</strong> Upon termination, Contractor shall return or securely destroy all PHI.</p>
      <p className="mb-2"><strong>12. Indemnification (HIPAA-Specific).</strong> Contractor shall indemnify Company for any violations of HIPAA caused by Contractor.</p>
      <p className="mb-2"><strong>13. Survival.</strong> These obligations survive termination of the Agreement.</p>

      {/* SIGNATURE BLOCK */}
      <div className="mt-10 border-t-2 border-black pt-8">
        <div className="mb-8">
          <p className="font-bold text-black mb-4">ROOTED VOICES SPEECH &amp; LANGUAGE THERAPY, LLC</p>
          <div className="space-y-3">
            <div className="flex items-end gap-2">
              <span className="text-gray-700 w-20 shrink-0">By:</span>
              {s?.companySignatureUrl ? (
                <SignatureImage src={s.companySignatureUrl} alt="Company signature" />
              ) : (
                <span className="flex-1 border-b border-gray-400" />
              )}
            </div>
            <div className="flex items-end gap-2">
              <span className="text-gray-700 w-20 shrink-0">Name:</span>
              <span className="font-semibold text-black">{companyName}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-gray-700 w-20 shrink-0">Title:</span>
              <span className="font-semibold text-black">{companyTitle}</span>
            </div>
            {s?.companySignedAt && (
              <div className="flex items-end gap-2">
                <span className="text-gray-700 w-20 shrink-0">Date:</span>
                <span className="font-semibold text-black">{new Date(s.companySignedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="font-bold text-black mb-4">CONTRACTOR</p>
          <div className="space-y-3">
            <div className="flex items-end gap-2">
              <span className="text-gray-700 w-20 shrink-0">By:</span>
              {s?.contractorSignatureUrl ? (
                <SignatureImage src={s.contractorSignatureUrl} alt="Contractor signature" />
              ) : (
                <span className="flex-1 border-b border-gray-400" />
              )}
            </div>
            <div className="flex items-end gap-2">
              <span className="text-gray-700 w-20 shrink-0">Printed Name:</span>
              {s?.contractorName ? <span className="font-semibold text-black">{s.contractorName}</span> : <span className="flex-1 border-b border-gray-400" />}
            </div>
            <div className="flex items-end gap-2">
              <span className="text-gray-700 w-20 shrink-0">Signature:</span>
              {s?.contractorSignatureUrl ? (
                <SignatureImage src={s.contractorSignatureUrl} alt="Contractor signature" />
              ) : (
                <span className="flex-1 border-b border-gray-400" />
              )}
            </div>
            <div className="flex items-end gap-2">
              <span className="text-gray-700 w-20 shrink-0">Date:</span>
              {s?.contractorSignedAt ? <span className="font-semibold text-black">{new Date(s.contractorSignedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span> : <span className="flex-1 border-b border-gray-400" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
