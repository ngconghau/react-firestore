import md5 from 'md5'
import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/router'
import { database, auth, serverTimestamp } from '../firebase'

const AuthContext = createContext()
 
const useAuth = () => {
  return useContext(AuthContext)
}
const AuthProvider = ({ children }) => {
  const router = useRouter()
  const [user, setUser] = useState()
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    dateofbirth: '',
    hasAccount: false,
  })

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })
  }
  const handleSignIn = async (e) => {
    e.preventDefault()
    auth
      .signInWithEmailAndPassword(values.email, md5(values.password))
      .then(() => {
        router.back()
      })
      .catch((err) => {
        alert(err.message)
      })
  }

  const clearState = () => {
    setValues({
      username: '',
      email: '',
      password: '',
      hasAccount: !values.hasAccount,
      dateofbirth: '',
    })
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    auth
      .createUserWithEmailAndPassword(values.email, md5(values.password))
      .then((resultUser) => {
        database.collection('users').doc(resultUser.user.uid).set({
          name: values.username,
          email: values.email,
          dob: values.dateofbirth,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        router.replace('/')
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.')
        } else {
          alert(errorMessage)
        }
      })
  }

  const handleLogOut = () => {
    auth.signOut().then(() => {
      setUser('')
      router.replace('/')
    })
  }

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((user) => {
      if (user) {
        database
          .collection('users')
          .doc(user.uid)
          .onSnapshot((querySnapshot) => {
            if (querySnapshot.exists) {
              setUser({
                id: user.uid,
                name: querySnapshot.data().name,
                email: querySnapshot.data().email,
                dateofbirth: querySnapshot.data().dob,
              })
            }
          })
      } else {
        router.push('/login/')
        setUser('')
      }
    })
    return () => unsubcribe()
  },[])

  const authValues = {
    user,
    values,
    handleSignIn,
    handleOnChange,
    clearState,
    handleSignUp,
    handleLogOut,
  }

  return (
    <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
  )
}

export { AuthProvider, useAuth }
