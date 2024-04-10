import { Table } from "@radix-ui/themes";
import { Button, Modal, Flex, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { supabase } from "../db/supabaseClient";
import { useForm } from "react-hook-form";

const MouseRow = ({
  mouse,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage,
  fetchMiceData,
  handleInputChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [opened, { open, close }] = useDisclosure(false);

  const handleDeleteMouse = async (mouseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this mouse?",
    );
    if (confirmed) {
      const { data, error } = await supabase
        .from("mice")
        .delete()
        .eq("mouse_id", mouseId);
      if (error) {
        console.error("Error deleting mouse:", error.message);
      } else {
        fetchMiceData();
        console.log("Mouse deleted successfully:", data);
      }
    }
  };

  const handleUpdateMouse = async (e) => {
    const { mouse_id, name, image_url } = e;
    const { data, error } = await supabase
      .from("mice")
      .update({ name: name, image_url: image_url })
      .eq("mouse_id", mouse_id);
    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      return;
    }
    setSuccessMessage("Mouse edited successfully!");
    fetchMiceData();
    console.log("EVENT", e);
    console.log("DATA", data);
  };

  return (
    <>
      <Table.Row align={"center"}>
        <Table.RowHeaderCell>{mouse.name}</Table.RowHeaderCell>
        <Table.Cell>{mouse.image_url}</Table.Cell>
        <Table.Cell>
          <Button variant="outline" onClick={open}>
            Edit
          </Button>
        </Table.Cell>
        <Table.Cell>
          <Button
            variant="outline"
            color="red"
            onClick={() => handleDeleteMouse(mouse.mouse_id)}
          >
            Delete
          </Button>
        </Table.Cell>
      </Table.Row>

      <Modal opened={opened} onClose={close} title="Edit Mouse" centered>
        <form
          onSubmit={handleSubmit(handleUpdateMouse)}
          onChange={handleInputChange}
        >
          <TextInput
            label="ID"
            defaultValue={mouse.mouse_id}
            readOnly
            {...register("mouse_id", {
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
            defaultValue={mouse.name}
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
            defaultValue={mouse.image_url}
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
              Edit Mouse
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

export default MouseRow;
