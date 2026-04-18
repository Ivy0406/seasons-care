import getAvatarSrcByKey from '@/assets/images/avatars';
import type { CareLogEntry } from '@/pages/CareLog/types';
import type { EventSeriesItem } from '@/types/eventSeries';
import type { GroupMember } from '@/types/group';

function toParticipants(
  participantIds: string[],
  groupMembers: GroupMember[],
): CareLogEntry['participants'] {
  return participantIds.map((participantId) => {
    const matchedMember = groupMembers.find(
      (member) => member.userId === participantId,
    );

    return {
      id: participantId,
      name: matchedMember?.username ?? '成員',
      src: matchedMember ? getAvatarSrcByKey(matchedMember.avatarKey) : '',
    };
  });
}

function toEventSeriesEntries(
  items: EventSeriesItem[],
  _month: Date,
  groupMembers: GroupMember[] = [],
): CareLogEntry[] {
  return items.map((item) => ({
    id: `${item.eventSeriesId}__${item.scheduledAt ?? item.startsAt ?? ''}`,
    sourceId: item.eventSeriesId,
    sourceType: 'event-series',
    title: item.title,
    description: item.description,
    startsAt: item.scheduledAt ?? item.startsAt ?? '',
    updatedAt: item.updatedAt,
    repeatPattern: item.repeatPattern,
    participants: toParticipants(item.participants, groupMembers),
    status: item.status === 'completed' ? 'completed' : 'pending',
    isImportant: item.isImportant,
  }));
}

export default toEventSeriesEntries;
