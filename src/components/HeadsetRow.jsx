import { Table } from "@radix-ui/themes";
import { Button, Modal, Flex, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { supabase } from "../db/supabaseClient";
import { useForm } from "react-hook-form";

const HeadsetRow = ({
  headset,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage,
  fetchHeadsetsData,
  handleInputChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [opened, { open, close }] = useDisclosure(false);

  const handleDeleteHeadset = async (headsetId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this headset?",
    );
    if (confirmed) {
      const { data, error } = await supabase
        .from("headsets")
        .delete()
        .eq("headset_id", headsetId);
      if (error) {
        console.error("Error deleting headset:", error.message);
      } else {
        fetchHeadsetsData();
        console.log("Headset deleted successfully:", data);
      }
    }
  };

  const handleUpdateHeadset = async (e) => {
    const { headset_id, name, image_url } = e;
    const { data, error } = await supabase
      .from("headsets")
      .update({ name: name, image_url: image_url })
      .eq("headset_id", headset_id);
    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      return;
    }
    setSuccessMessage("Headset edited successfully!");
    fetchHeadsetsData();
    console.log("EVENT", e);
    console.log("DATA", data);
  };

  return (
    <>
      <Table.Row align={"center"}>
        <Table.RowHeaderCell>{headset.name}</Table.RowHeaderCell>
        <Table.Cell>{headset.image_url}</Table.Cell>
        <Table.Cell>
          <Button variant="outline" onClick={open}>
            Edit
          </Button>
        </Table.Cell>
        <Table.Cell>
          <Button
            variant="outline"
            color="red"
            onClick={() => handleDeleteHeadset(headset.headset_id)}
          >
            Delete
          </Button>
        </Table.Cell>
      </Table.Row>

      <Modal opened={opened} onClose={close} title="Edit Headset" centered>
        <form
          onSubmit={handleSubmit(handleUpdateHeadset)}
          onChange={handleInputChange}
        >
          <TextInput
            label="ID"
            defaultValue={headset.headset_id}
            readOnly
            {...register("headset_id", {
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
            defaultValue={headset.name}
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
            defaultValue={headset.image_url}
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
              Edit Headset
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

export default HeadsetRow;
