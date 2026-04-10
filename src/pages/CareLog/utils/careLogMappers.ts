import getAvatarSrcByKey from '@/assets/images/avatars';
import type { CalendarDiaryCardParticipant } from '@/components/common/DiaryCard';
import type { CareLogEntry } from '@/pages/CareLog/types';
import type { CareLogApiItem, CreateCareLogPayload } from '@/types/careLog';
import type { GroupMember } from '@/types/group';

const toCreateCareLogPayload = (
  entry: CareLogEntry,
  currentUserId: string,
): CreateCareLogPayload => {
  const payload: CreateCareLogPayload = {
    title: entry.title,
    description: entry.description,
    startsAt: new Date(entry.startsAt).toISOString(),
    repeatPattern: entry.repeatPattern ?? 'none',
    participants: [currentUserId],
    status: entry.status,
    isImportant: entry.isImportant ?? false,
  };

  return payload;
};

function toCareLogStatus(
  status: CareLogApiItem['status'],
  fallbackStatus: CareLogEntry['status'] = 'pending',
) {
  if (status === 'pending' || status === 'completed') {
    return status;
  }

  return fallbackStatus;
}

function toCareLogParticipants(
  participants: CareLogApiItem['participants'],
  groupMembers: GroupMember[],
  fallbackParticipants: CalendarDiaryCardParticipant[] = [],
) {
  if (!participants || participants.length === 0) {
    return fallbackParticipants;
  }

  return participants.map((participantId) => {
    const matchedMember = groupMembers.find(
      (member) => member.userId === participantId,
    );
    const fallbackParticipant = fallbackParticipants.find(
      (participant) => participant.id === participantId,
    );

    if (matchedMember) {
      return {
        id: participantId,
        name: matchedMember.username,
        src: getAvatarSrcByKey(matchedMember.avatarKey),
      };
    }

    if (fallbackParticipant) {
      return fallbackParticipant;
    }

    return {
      id: participantId,
      name: '成員',
      src: '',
    };
  });
}

const toCareLogEntry = (
  item: CareLogApiItem,
  fallbackEntry?: CareLogEntry,
  groupMembers: GroupMember[] = [],
): CareLogEntry => ({
  id: item.id,
  title: item.title,
  description:
    item.description ?? item.content ?? fallbackEntry?.description ?? '',
  startsAt:
    item.startsAt ??
    item.recordDate ??
    fallbackEntry?.startsAt ??
    new Date().toISOString(),
  repeatPattern: item.repeatPattern ?? fallbackEntry?.repeatPattern ?? 'none',
  participants: toCareLogParticipants(
    item.participants,
    groupMembers,
    fallbackEntry?.participants,
  ),
  status: toCareLogStatus(item.status, fallbackEntry?.status),
  isImportant: item.isImportant ?? fallbackEntry?.isImportant ?? false,
});

const toCareLogEntries = (
  items: CareLogApiItem[],
  groupMembers: GroupMember[] = [],
) => items.map((item) => toCareLogEntry(item, undefined, groupMembers));

export { toCreateCareLogPayload, toCareLogEntry, toCareLogEntries };
