export interface Invite {
  id: string
  email: string
  republicaId: string
  republicaName: string
  ownerId: string
  ownerName: string
  createdAt: string
  acceptedAt?: string
  status: "pending" | "accepted" | "rejected"
}

// Get all invites for an email
export const getInvitesByEmail = (email: string): Invite[] => {
  const data = localStorage.getItem("republicar_invites")
  const invites = data ? JSON.parse(data) : []
  return invites.filter((i: Invite) => i.email === email)
}

// Get pending invites for an email
export const getPendingInvites = (email: string): Invite[] => {
  const invites = getInvitesByEmail(email)
  return invites.filter((i: Invite) => i.status === "pending")
}

// Create an invite for a tenant
export const createInvite = (
  email: string,
  republicaId: string,
  republicaName: string,
  ownerId: string,
  ownerName: string,
): Invite => {
  const data = localStorage.getItem("republicar_invites")
  const invites = data ? JSON.parse(data) : []

  const newInvite: Invite = {
    id: Date.now().toString(),
    email,
    republicaId,
    republicaName,
    ownerId,
    ownerName,
    createdAt: new Date().toISOString(),
    status: "pending",
  }

  invites.push(newInvite)
  localStorage.setItem("republicar_invites", JSON.stringify(invites))

  return newInvite
}

// Accept an invite
export const acceptInvite = (inviteId: string) => {
  const data = localStorage.getItem("republicar_invites")
  const invites = data ? JSON.parse(data) : []
  const index = invites.findIndex((i: Invite) => i.id === inviteId)

  if (index !== -1) {
    invites[index].status = "accepted"
    invites[index].acceptedAt = new Date().toISOString()
    localStorage.setItem("republicar_invites", JSON.stringify(invites))
  }
}

// Reject an invite
export const rejectInvite = (inviteId: string) => {
  const data = localStorage.getItem("republicar_invites")
  const invites = data ? JSON.parse(data) : []
  const index = invites.findIndex((i: Invite) => i.id === inviteId)

  if (index !== -1) {
    invites[index].status = "rejected"
    localStorage.setItem("republicar_invites", JSON.stringify(invites))
  }
}

// Get invite by ID
export const getInviteById = (inviteId: string): Invite | null => {
  const data = localStorage.getItem("republicar_invites")
  const invites = data ? JSON.parse(data) : []
  return invites.find((i: Invite) => i.id === inviteId) || null
}
