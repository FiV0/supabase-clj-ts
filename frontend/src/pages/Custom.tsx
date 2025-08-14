import { useState, useEffect } from 'react'
import supabase from '@/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { User } from '@supabase/supabase-js'

interface ApiResult {
  success: boolean
  status: number
  statusText: string
  headers: Record<string, string>
  data: any
  error?: string
}

export function Custom() {
  const [user, setUser] = useState<User | null>(null)
  const [apiResult, setApiResult] = useState<ApiResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const fetchCustomAPI = async () => {
    setLoading(true)
    setApiResult(null)
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/custom-api/v1/custom`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        },
      })

      // Convert headers to a plain object
      const headers: Record<string, string> = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })

      let data: any
      let error: string | undefined

      try {
        const text = await response.text()
        if (text) {
          data = JSON.parse(text)
        } else {
          data = null
        }
      } catch (parseErr) {
        // If JSON parsing fails, store the raw text
        data = await response.text()
        error = 'Response is not valid JSON'
      }

      setApiResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers,
        data,
        error
      })

    } catch (err) {
      setApiResult({
        success: false,
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: null,
        error: err instanceof Error ? err.message : 'An error occurred'
      })
      console.error('Error fetching custom API:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Custom API</h1>
        <p className="text-lg text-muted-foreground">
          Test your custom backend API endpoint
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Request</CardTitle>
          <CardDescription>
            Make a request to /custom-api/v1/custom/ with your current authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={fetchCustomAPI} disabled={loading}>
              {loading ? 'Loading...' : 'Fetch Custom API'}
            </Button>
            {user && (
              <span className="text-sm text-muted-foreground">
                Authenticated as: {user.email}
              </span>
            )}
          </div>
          
          {apiResult && (
            <div className={`p-4 border rounded-md ${
              apiResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className={`font-medium mb-3 ${
                apiResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {apiResult.success ? 'Success' : 'Error'} - {apiResult.status} {apiResult.statusText}
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className={`font-medium mb-1 ${
                    apiResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    Response Headers:
                  </p>
                  <pre className={`text-xs whitespace-pre-wrap overflow-auto p-2 rounded bg-gray-100 ${
                    apiResult.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {JSON.stringify(apiResult.headers, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <p className={`font-medium mb-1 ${
                    apiResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    Response Body:
                  </p>
                  <pre className={`text-sm whitespace-pre-wrap overflow-auto p-2 rounded bg-gray-100 ${
                    apiResult.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {typeof apiResult.data === 'string' 
                      ? apiResult.data 
                      : JSON.stringify(apiResult.data, null, 2)
                    }
                  </pre>
                </div>
                
                {apiResult.error && (
                  <div>
                    <p className="font-medium mb-1 text-red-700">
                      Additional Error Info:
                    </p>
                    <p className="text-sm text-red-600 p-2 rounded bg-gray-100">
                      {apiResult.error}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}