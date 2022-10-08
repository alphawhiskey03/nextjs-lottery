import {useMoralis} from "react-moralis"
import {useEffect} from "react"
const Header=()=>{
    const {enableWeb3,account,isWeb3Enabled,Moralis,deactivateWeb3,isWeb3EnableLoading}=useMoralis()
    useEffect(()=>{
        if(isWeb3Enabled) return
        if(typeof window != undefined){
            if(window.localStorage.getItem("connected")){
                console.log("here")
                enableWeb3()
            }
        }
    },[isWeb3Enabled])
    
    useEffect(()=>{Moralis.onAccountChanged(account=>{
        console.log("account changed to ",account)
        if(account==null){
            window.localStorage.removeItem("connected")
            deactivateWeb3()
        }
    })},[])
    return (
        <>
        {account ?(<div>Connected to {account.slice(0,6)}...{account.slice(account.length-4)}!</div>):(
      <button onClick={async ()=>{await enableWeb3(); if(typeof window !=undefined){
        window.localStorage.setItem("connected","injected")
      }}}
      disabled={isWeb3EnableLoading}>Connect</button>
      )}
        </>
    )
}

export default Header;