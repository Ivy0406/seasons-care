type AuthPayload = {
  email: string;
  password: string;
};

type SetupProfilePayload = {
  userName: string;
  avatarKey: string;
};

type AuthUser = {
  id: string;
  email: string;
  userName: string;
  avatarKey: string;
  isProfileCompleted: boolean;
};

type LoginResponse = {
  success: boolean;
  data: {
    token: string;
    user: AuthUser;
  };
  traceId: string;
};

export type { AuthPayload, SetupProfilePayload, AuthUser, LoginResponse };
