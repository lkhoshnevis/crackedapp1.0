'use client'

import { useState } from 'react'
import { AdminService } from '@/lib/admin'
import { Upload, RefreshCw } from 'lucide-react'

export default function AdminPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [profilesCount, setProfilesCount] = useState(0)

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadMessage('')

    try {
      const content = await file.text()
      console.log('CSV content length:', content.length)
      console.log('First 500 chars:', content.substring(0, 500))
      
      const result = await AdminService.uploadCSV(content)
      
      setUploadMessage(result.message)
      setProfilesCount(prev => prev + result.profilesAdded)
      
      console.log('Upload result:', result)
    } catch (error) {
      console.error('Upload error:', error)
      setUploadMessage(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Upload CSV data to populate the DVHS alumni database
        </p>
      </div>

      {/* CSV Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload CSV Data</h2>
        
        <div className="space-y-6">
          {/* Upload Button */}
          <div className="flex items-center space-x-4">
            <label className="linkedin-button cursor-pointer inline-flex items-center px-6 py-3 text-lg">
              <Upload className="w-5 h-5 mr-2" />
              Choose CSV File
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            
            {uploading && (
              <div className="flex items-center text-gray-500">
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Processing CSV...
              </div>
            )}
          </div>

          {/* Upload Status */}
          {uploadMessage && (
            <div className={`p-4 rounded-lg text-sm ${
              uploadMessage.includes('Successfully') 
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {uploadMessage}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">CSV Format Requirements</h3>
            <p className="text-blue-800 text-sm mb-2">
              Your CSV should include these columns (from LinkedIn export):
            </p>
            <ul className="text-blue-800 text-sm list-disc list-inside space-y-1">
              <li><strong>Profile_Name</strong> - Full name of the alumni</li>
              <li><strong>addressWithoutCountry</strong> - Location</li>
              <li><strong>Profile_Picture_URL</strong> - LinkedIn profile picture URL</li>
              <li><strong>High School</strong> - High school name</li>
              <li><strong>DVHS class of</strong> - Graduation year</li>
              <li><strong>College_1_Name, College_1_Degree, College_1_Logo</strong> - Primary college info</li>
              <li><strong>Experience_1_Company, Experience_1_Role, Experience_1_Logo</strong> - Primary work experience</li>
              <li>Additional college/experience columns (2, 3, 4) as available</li>
            </ul>
          </div>

          {/* Current Status */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Current Status</h3>
            <p className="text-gray-600 text-sm">
              Total profiles in database: <span className="font-semibold">{profilesCount}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="/"
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
        >
          <h3 className="font-semibold text-gray-900 mb-1">Home</h3>
          <p className="text-gray-600 text-sm">View the main site</p>
        </a>
        
        <a
          href="/vote"
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
        >
          <h3 className="font-semibold text-gray-900 mb-1">Vote</h3>
          <p className="text-gray-600 text-sm">Test the voting system</p>
        </a>
        
        <a
          href="/leaderboard"
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
        >
          <h3 className="font-semibold text-gray-900 mb-1">Leaderboard</h3>
          <p className="text-gray-600 text-sm">View rankings</p>
        </a>
      </div>
    </div>
  )
}