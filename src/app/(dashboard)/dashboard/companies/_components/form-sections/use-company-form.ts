"use client"

import * as React from "react"
import { useResolveGoogleMaps } from "@/hooks/modules/company"
import type { Company, CreateCompanyPayload, UpdateCompanyPayload } from "@/types/company"
import type { Department } from "@/types/department"
import { useCompanyImageUpload } from "./use-company-image-upload"

interface UseCompanyFormProps {
  editingCompany: Company | null
  departments: Department[]
  onClose: () => void
  onSave: (args: {
    isEdit: boolean
    payload: CreateCompanyPayload | UpdateCompanyPayload
    name: string
  }) => Promise<void>
}

export function useCompanyForm({
  editingCompany,
  departments,
  onClose,
  onSave,
}: UseCompanyFormProps) {
  const [name, setName] = React.useState(editingCompany ? editingCompany.name : "")
  const [email, setEmail] = React.useState(editingCompany?.email || "")
  const [phoneNumber, setPhoneNumber] = React.useState(editingCompany?.phone_number || "")
  const [address, setAddress] = React.useState(editingCompany?.address || "")
  const [description, setDescription] = React.useState(editingCompany?.description || "")
  const [imageUrl, setImageUrl] = React.useState(editingCompany?.image_url || "")
  const [gmapsLink, setGmapsLink] = React.useState(editingCompany?.gmaps_link || "")
  const [lat, setLat] = React.useState(editingCompany?.lat != null ? String(editingCompany.lat) : "")
  const [lng, setLng] = React.useState(editingCompany?.lng != null ? String(editingCompany.lng) : "")
  const [status, setStatus] = React.useState<"active" | "inactive">(editingCompany?.status || "active")
  const [selectedDeptIds, setSelectedDeptIds] = React.useState<string[]>(
    editingCompany?.departments?.map((d) => d.id) || []
  )
  const [formError, setFormError] = React.useState<string | null>(null)

  const selectedDepts = React.useMemo(
    () => departments.filter((d) => selectedDeptIds.includes(d.id)),
    [departments, selectedDeptIds]
  )

  const imageUpload = useCompanyImageUpload({
    companyId: editingCompany?.id,
    setImageUrl,
  })

  const resolveMapsMutation = useResolveGoogleMaps()
  const [resolveNotice, setResolveNotice] = React.useState<{ type: "success" | "error"; message: string } | null>(null)
  const [lastResolvedLink, setLastResolvedLink] = React.useState<string>(editingCompany?.gmaps_link || "")

  const handleResolveMaps = async () => {
    if (!gmapsLink.trim()) {
      setResolveNotice({ type: "error", message: "Masukkan tautan Google Maps terlebih dahulu." })
      return
    }
    setResolveNotice(null)
    try {
      const res = await resolveMapsMutation.mutateAsync({ url: gmapsLink.trim() })
      setLat(String(res.lat))
      setLng(String(res.lng))
      setLastResolvedLink(gmapsLink.trim())
      setResolveNotice({ type: "success", message: `Koordinat berhasil didapatkan: (${res.lat}, ${res.lng})` })
    } catch (err) {
      setResolveNotice({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal mendeteksi koordinat dari Google Maps.",
      })
    }
  }

  const handleDeptToggle = (deptId: string) => {
    setSelectedDeptIds((prev) => (prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!name.trim()) {
      setFormError("Nama perusahaan wajib diisi.")
      return
    }
    const parsedLat = lat.trim() ? parseFloat(lat.trim()) : null
    const parsedLng = lng.trim() ? parseFloat(lng.trim()) : null

    if (lat.trim() && isNaN(Number(lat.trim()))) {
      setFormError("Latitude harus berupa angka desimal yang valid.")
      return
    }
    if (lng.trim() && isNaN(Number(lng.trim()))) {
      setFormError("Longitude harus berupa angka desimal yang valid.")
      return
    }

    try {
      await onSave({
        isEdit: Boolean(editingCompany),
        payload: {
          name: name.trim(),
          email: email.trim() || null,
          phone_number: phoneNumber.trim() || null,
          address: address.trim() || null,
          description: description.trim() || null,
          image_url: imageUrl.trim() || null,
          gmaps_link: gmapsLink.trim() || null,
          lat: parsedLat,
          lng: parsedLng,
          status,
          department_ids: selectedDeptIds,
        },
        name: name.trim(),
      })
      onClose()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan data perusahaan.")
    }
  }

  return {
    name, setName,
    email, setEmail,
    phoneNumber, setPhoneNumber,
    address, setAddress,
    description, setDescription,
    imageUrl, setImageUrl,
    gmapsLink, setGmapsLink,
    lat, setLat,
    lng, setLng,
    status, setStatus,
    selectedDeptIds, selectedDepts,
    formError,
    imageUpload,
    isResolving: resolveMapsMutation.isPending,
    lastResolvedLink,
    resolveNotice,
    handleResolveMaps,
    handleDeptToggle,
    handleSubmit,
  }
}
