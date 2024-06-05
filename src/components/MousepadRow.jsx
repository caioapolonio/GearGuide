import { Table } from "@radix-ui/themes";
import { Button, Modal, Flex, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { supabase } from "../db/supabaseClient";
import { useForm } from "react-hook-form";

const MousepadRow = ({
  mousepad,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage,
  fetchMousepadsData,
  handleInputChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [opened, { open, close }] = useDisclosure(false);

  const handleDeleteMousepad = async (mousepadId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this mousepad?",
    );
    if (confirmed) {
      const { data, error } = await supabase
        .from("mousepads")
        .delete()
        .eq("mousepad_id", mousepadId);
      if (error) {
        console.error("Error deleting mousepad:", error.message);
      } else {
        fetchMousepadsData();
        console.log("Mousepad deleted successfully:", data);
      }
    }
  };

  const handleUpdateMousepad = async (e) => {
    const { mousepad_id, name, image_url } = e;
    const { data, error } = await supabase
      .from("mousepads")
      .update({ name: name, image_url: image_url })
      .eq("mousepad_id", mousepad_id);
    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      return;
    }
    setSuccessMessage("Mousepad edited successfully!");
    fetchMousepadsData();
    console.log("EVENT", e);
    console.log("DATA", data);
  };

  return (
    <>
      <Table.Row align={"center"}>
        <Table.RowHeaderCell>{mousepad.name}</Table.RowHeaderCell>
        <Table.Cell>
          <img src={mousepad.image_url} alt="" className="h-16 w-16" />
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
            onClick={() => handleDeleteMousepad(mousepad.mousepad_id)}
          >
            Delete
          </Button>
        </Table.Cell>
      </Table.Row>

      <Modal opened={opened} onClose={close} title="Edit Mousepad" centered>
        <form
          onSubmit={handleSubmit(handleUpdateMousepad)}
          onChange={handleInputChange}
        >
          <TextInput
            label="ID"
            defaultValue={mousepad.mousepad_id}
            readOnly
            {...register("mousepad_id", {
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
            defaultValue={mousepad.name}
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
            defaultValue={mousepad.image_url}
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
              Edit Mousepad
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

export default MousepadRow;
