import { Table } from "@radix-ui/themes";
import { Button, Modal, Flex, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { supabase } from "../db/supabaseClient";
import { useForm } from "react-hook-form";

const KeyboardRow = ({
  keyboard,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage,
  fetchKeyboardsData,
  handleInputChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [opened, { open, close }] = useDisclosure(false);

  const handleDeleteKeyboard = async (keyboardId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this keyboard?",
    );
    if (confirmed) {
      const { data, error } = await supabase
        .from("keyboards")
        .delete()
        .eq("keyboard_id", keyboardId);
      if (error) {
        console.error("Error deleting keyboard:", error.message);
      } else {
        fetchKeyboardsData();
        console.log("Keyboard deleted successfully:", data);
      }
    }
  };

  const handleUpdateKeyboard = async (e) => {
    const { keyboard_id, name, image_url } = e;
    const { data, error } = await supabase
      .from("keyboards")
      .update({ name: name, image_url: image_url })
      .eq("keyboard_id", keyboard_id);
    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      return;
    }
    setSuccessMessage("Keyboard edited successfully!");
    fetchKeyboardsData();
    console.log("EVENT", e);
    console.log("DATA", data);
  };

  return (
    <>
      <Table.Row align={"center"}>
        <Table.RowHeaderCell>{keyboard.name}</Table.RowHeaderCell>
        <Table.Cell>{keyboard.image_url}</Table.Cell>
        <Table.Cell>
          <Button variant="outline" onClick={open}>
            Edit
          </Button>
        </Table.Cell>
        <Table.Cell>
          <Button
            variant="outline"
            color="red"
            onClick={() => handleDeleteKeyboard(keyboard.keyboard_id)}
          >
            Delete
          </Button>
        </Table.Cell>
      </Table.Row>

      <Modal opened={opened} onClose={close} title="Edit Keyboard" centered>
        <form
          onSubmit={handleSubmit(handleUpdateKeyboard)}
          onChange={handleInputChange}
        >
          <TextInput
            label="ID"
            defaultValue={keyboard.keyboard_id}
            readOnly
            {...register("keyboard_id", {
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
            defaultValue={keyboard.name}
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
            defaultValue={keyboard.image_url}
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
              Edit Keyboard
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

export default KeyboardRow;
