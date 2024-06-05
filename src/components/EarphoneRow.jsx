import { Table } from "@radix-ui/themes";
import { Button, Modal, Flex, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { supabase } from "../db/supabaseClient";
import { useForm } from "react-hook-form";

const EarphoneRow = ({
  earphone,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage,
  fetchEarphonesData,
  handleInputChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [opened, { open, close }] = useDisclosure(false);

  const handleDeleteEarphone = async (earphoneId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this earphone?",
    );
    if (confirmed) {
      const { data, error } = await supabase
        .from("earphones")
        .delete()
        .eq("earphone_id", earphoneId);
      if (error) {
        console.error("Error deleting earphone:", error.message);
      } else {
        fetchEarphonesData();
        console.log("Earphone deleted successfully:", data);
      }
    }
  };

  const handleUpdateEarphone = async (e) => {
    const { earphone_id, name, image_url } = e;
    const { data, error } = await supabase
      .from("earphones")
      .update({ name: name, image_url: image_url })
      .eq("earphone_id", earphone_id)
      .select();
    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      return;
    }
    setSuccessMessage("Earphone edited successfully!");
    fetchEarphonesData();
    console.log("EVENT", e);
    console.log("DATA", data);
  };

  return (
    <>
      <Table.Row align={"center"}>
        <Table.RowHeaderCell>{earphone.name}</Table.RowHeaderCell>
        <Table.Cell>
          <img src={earphone.image_url} alt="" className="h-16 w-16" />
        </Table.Cell>
        <Table.Cell>
          <Button variant="outline" onClick={open}>
            Edit
          </Button>
        </Table.Cell>
        <Table.Cell>
          <Button
            variant="outline"
            color="red"
            onClick={() => handleDeleteEarphone(earphone.earphone_id)}
          >
            Delete
          </Button>
        </Table.Cell>
      </Table.Row>

      <Modal opened={opened} onClose={close} title="Edit Earphone" centered>
        <form
          onSubmit={handleSubmit(handleUpdateEarphone)}
          onChange={handleInputChange}
        >
          <TextInput
            label="ID"
            defaultValue={earphone.earphone_id}
            readOnly
            {...register("earphone_id", {
              required: {
                value: true,
                message: "Preencha o campo de nome",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          <TextInput
            label="Name"
            placeholder="Name"
            mt="sm"
            defaultValue={earphone.name}
            {...register("name", {
              required: {
                value: true,
                message: "Preencha o campo de nome",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
          <TextInput
            label="Image"
            placeholder="Image url"
            mt="sm"
            defaultValue={earphone.image_url}
            {...register("image_url", {
              required: {
                value: true,
                message: "Preencha o campo de imagem",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          {errors.image_url && (
            <p className="text-sm text-red-600">{errors.image_url.message}</p>
          )}
          <Flex justify="center" align="center">
            <Button fullWidth type="submit" mt="sm">
              Edit Earphone
            </Button>
          </Flex>
          <Flex>
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
          </Flex>
        </form>
      </Modal>
    </>
  );
};

export default EarphoneRow;
