import * as React from 'react'

export function App() {
  React.useEffect(() => {
    FB.getLoginStatus(function (response) {
      console.log(response)
    })
  }, [])

  return (
    <div>
      <div
        className="fb-login-button"
        data-width="320"
        data-size="large"
        data-button-type="login_with"
        data-layout="rounded"
        data-auto-logout-link="true"
        data-use-continue-as="true"
      ></div>
    </div>
  )
}
