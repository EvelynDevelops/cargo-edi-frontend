"use client";

import CargoFormItem from "@/components/forms/CargoFormItem";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import HomeLayout from "@/components/layouts/HomeLayout";
import { useHomePageLogic } from "@/hooks/useHomePage";

/**
 * Home page component for generating EDI messages
 */
export default function HomePage() {
  const {
    // Form data
    cargoItems,
    formErrors,
    handleChange,
    handleAdd,
    handleDelete,
    registerFormRef,
    
    // Output and state
    ediOutput,
    loading,
    error,
    isModalOpen,
    
    // Action handlers
    handleDownload,
    handleClearAll,
    handleCopy,
    handleSubmit,
    handleOpenModal,
    handleCloseModal
  } = useHomePageLogic();

  return (
    <>
      <HomeLayout
        cargoItems={cargoItems}
        loading={loading}
        error={error}
        ediOutput={ediOutput}
        onClearAll={handleClearAll}
        onAdd={handleAdd}
        onGenerate={handleOpenModal}
        onDownload={handleDownload}
        onCopy={handleCopy}
      >
        {cargoItems.map((item, index) => (
          <CargoFormItem
            key={item.id}
            index={index}
            data={item}
            errors={formErrors[index]}
            onChange={handleChange}
            onDelete={cargoItems.length > 1 ? () => handleDelete(index) : undefined}
            ref={(ref) => registerFormRef(index, ref)}
          />
        ))}
      </HomeLayout>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleSubmit}
        cargoItems={cargoItems}
      />
    </>
  );
}
