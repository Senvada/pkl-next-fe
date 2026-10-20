"use client"

import * as React from "react"
import { Building2, Edit3, AlertCircle, Save } from "lucide-react"
import {
  FormDrawer,
  FormDrawerHeader,
  FormDrawerBody,
  FormDrawerFooter,
} from "@/components/shared/form-drawer"
import type { Company, CreateCompanyPayload, UpdateCompanyPayload } from "@/types/company"
import type { Department } from "@/types/department"
import { useCompanyForm } from "./form-sections/use-company-form"
import { CompanyBasicInfoSection } from "./form-sections/company-basic-info-section"
import { CompanyBannerSection } from "./form-sections/company-banner-section"
import { CompanyLocationSection } from "./form-sections/company-location-section"
import { CompanyDepartmentsSection } from "./form-sections/company-departments-section"

type SaveHandler = (args: {
  isEdit: boolean
  payload: CreateCompanyPayload | UpdateCompanyPayload
  name: string
}) => Promise<void>

interface CompanyFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingCompany: Company | null
  departments: Department[]
  isSaving: boolean
  onSave: SaveHandler
}

function CompanyFormDrawerContent({
  editingCompany,
  departments,
  isSaving,
  onClose,
  onSave,
}: {
  editingCompany: Company | null
  departments: Department[]
  isSaving: boolean
  onClose: () => void
  onSave: SaveHandler
}) {
  const form = useCompanyForm({ editingCompany, departments, onClose, onSave })
  const { imageUpload } = form

  return (
    <form onSubmit={form.handleSubmit} className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/40">
      <FormDrawerHeader
        icon={editingCompany ? <Edit3 className="size-5" /> : <Building2 className="size-5" />}
        title={editingCompany ? "Edit Data Mitra Industri" : "Tambah Mitra Industri Baru"}
        description={
          editingCompany
            ? `Perbarui informasi profil dan persyaratan jurusan untuk ${editingCompany.name}.`
            : "Lengkapi data profil tempat magang baru untuk portal informasi PKL siswa."
        }
      />

      <FormDrawerBody>
        {form.formError && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-medium">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{form.formError}</span>
          </div>
        )}

        <CompanyBasicInfoSection
          name={form.name} setName={form.setName}
          status={form.status} setStatus={form.setStatus}
          email={form.email} setEmail={form.setEmail}
          phoneNumber={form.phoneNumber} setPhoneNumber={form.setPhoneNumber}
          address={form.address} setAddress={form.setAddress}
          description={form.description} setDescription={form.setDescription}
        />

        <CompanyBannerSection
          imageUrl={form.imageUrl}
          name={form.name}
          description={form.description}
          address={form.address}
          status={form.status}
          selectedDepts={form.selectedDepts}
          imageUpload={imageUpload}
          onImageUrlChange={form.setImageUrl}
        />

        <CompanyLocationSection
          gmapsLink={form.gmapsLink} setGmapsLink={form.setGmapsLink}
          lat={form.lat} setLat={form.setLat}
          lng={form.lng} setLng={form.setLng}
          isResolving={form.isResolving}
          lastResolvedLink={form.lastResolvedLink}
          resolveNotice={form.resolveNotice}
          onResolveMaps={form.handleResolveMaps}
        />

        <CompanyDepartmentsSection
          departments={departments}
          selectedDeptIds={form.selectedDeptIds}
          onDeptToggle={form.handleDeptToggle}
        />
      </FormDrawerBody>

      <FormDrawerFooter
        onCancel={onClose}
        isSaving={isSaving}
        disabled={imageUpload.isUploading}
        saveText={editingCompany ? "Simpan Perubahan" : "Tambah Mitra"}
        saveIcon={<Save className="size-3.5 mr-1.5" />}
      />
    </form>
  )
}

export function CompanyFormDrawer({
  open,
  onOpenChange,
  editingCompany,
  departments,
  isSaving,
  onSave,
}: CompanyFormDrawerProps) {
  return (
    <FormDrawer open={open} onOpenChange={onOpenChange} size="xl">
      {open && (
        <CompanyFormDrawerContent
          key={editingCompany?.id ?? "new-company"}
          editingCompany={editingCompany}
          departments={departments}
          isSaving={isSaving}
          onClose={() => onOpenChange(false)}
          onSave={onSave}
        />
      )}
    </FormDrawer>
  )
}
