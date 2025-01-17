import { UserDTO } from "@dtos/user-dto";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../http/api";

import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from '@storage/storage-auth-token'
import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storage-user";

export type AuthContextDataProps = {
  user: UserDTO
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isLoadingUserStorageData: boolean
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)

  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  async function updateUserAndToken(user: UserDTO, token: string) {
    api.defaults.headers.common['Authorization'] = `Baerer ${token}`
    setUser(user)
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password })
  
      if (data.user && data.token) {
        setIsLoadingUserStorageData(true)

        await storageUserSave(data.user)
        await storageAuthTokenSave(data.token)

        updateUserAndToken(data.user, data.token)
      }
    } catch (err) {
      throw err 
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()
    } catch (err) {
      throw err
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet()
      const token = await storageAuthTokenGet()

      if (token && userLogged) {
        updateUserAndToken(userLogged, token)
      }
    } catch (err) {
      throw err
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoadingUserStorageData }}>
      {children}
    </AuthContext.Provider>
  )
}