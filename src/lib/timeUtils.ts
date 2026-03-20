export const formatSessionTimes = (
    dateString: string | undefined,
    timeString: string | undefined,
    therapistTz: string | undefined,
    userRole: 'client' | 'therapist'
): { primaryText: string; secondaryText: string | null } => {
    if (!dateString || !timeString) {
        return { primaryText: timeString || 'Time TBD', secondaryText: null };
    }

    const clientTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!therapistTz) {
        return { primaryText: timeString, secondaryText: null };
    }

    if (therapistTz === clientTz) {
        return { primaryText: timeString, secondaryText: null };
    }

    try {
        const d = new Date(dateString);
        const yr = d.getFullYear();
        const mo = String(d.getMonth() + 1).padStart(2, '0');
        const da = String(d.getDate()).padStart(2, '0');

        const match = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return { primaryText: timeString, secondaryText: null };

        let hours = parseInt(match[1], 10);
        const minutes = match[2];
        const isPM = match[3].toUpperCase() === 'PM';

        if (isPM && hours < 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;

        // We assume the stored session time belongs to the therapist's timezone.
        // E.g., '2023-10-10T14:30:00'
        const isoString = `${yr}-${mo}-${da}T${String(hours).padStart(2, '0')}:${minutes}:00`;

        // Since we only need to show localized times relative to client and therapist,
        // let's use standard JS formatting to get the difference between the two timezones.
        const getOffsetMillis = (tz: string) => {
            const date = new Date(yr, d.getMonth(), d.getDate(), hours, parseInt(minutes, 10), 0);
            const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }).formatToParts(date);
            const p = (t: string) => parseInt(parts.find(x => x.type === t)?.value || '0', 10);
            const tzDate = new Date(p('year'), p('month') - 1, p('day'), p('hour'), p('minute'), p('second'));
            return tzDate.getTime() - date.getTime();
        };

        const hostOffset = getOffsetMillis(therapistTz);
        const clientOffset = getOffsetMillis(clientTz);

        const localRef = new Date(yr, d.getMonth(), d.getDate(), hours, parseInt(minutes, 10), 0);

        // Therapist local time
        // Client local time
        const clientTimeValue = new Date(localRef.getTime() - hostOffset + clientOffset);

        const getTzAbbrev = (tz: string, timeValue: Date) => {
            try {
                const str = timeValue.toLocaleTimeString('en-US', { timeZone: tz, timeZoneName: 'short' });
                const split = str.split(' ');
                return split.length > 2 ? split.slice(2).join(' ') : '';
            } catch (e) {
                return '';
            }
        };

        const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

        const clientFormatted = `${formatTime(clientTimeValue)} ${getTzAbbrev(clientTz, clientTimeValue)}`.trim();
        const therapistFormatted = `${formatTime(localRef)} ${getTzAbbrev(therapistTz, localRef)}`.trim();

        if (userRole === 'client') {
            return {
                primaryText: clientFormatted,
                secondaryText: `(${therapistFormatted} Therapist Time)`
            };
        } else {
            return {
                primaryText: therapistFormatted,
                secondaryText: `(${clientFormatted} Client Time)`
            };
        }
    } catch (e) {
        console.error('Time conversion error:', e);
        return { primaryText: timeString, secondaryText: null };
    }
};
