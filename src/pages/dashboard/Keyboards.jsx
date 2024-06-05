import { useState, useEffect } from "react";
import { supabase } from "../../db/supabaseClient";
import { useForm } from "react-hook-form";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Flex, TextInput } from "@mantine/core";
import { Table } from "@radix-ui/themes";
import Dashboard from "../../components/Dashboard";
import KeyboardRow from "../../components/KeyboardRow";

const Keyboards = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [keyboardsData, setKeyboardsData] = useState([]);

  const handleInputChange = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (e) => {
    const { name, image_url } = e;
    const { data, error } = await supabase
      .from("keyboards")
      .insert({ name: name, image_url: image_url })
      .select();
    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      return;
    } else {
      setSuccessMessage("Keyboard added successfully!");
      reset();
      fetchKeyboardsData();
      console.log("EVENT", e);
      console.log("DATA", data);
    }
  };

  async function fetchKeyboardsData() {
    try {
      const { data, error } = await supabase
        .from("keyboards")
        .select("*")
        .order("keyboard_id", { ascending: false });

      if (error) {
        throw error;
      }
      console.log(data);
      setKeyboardsData(data);
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  }

  useEffect(() => {
    fetchKeyboardsData();
  }, []);

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Dashboard>
      <Modal opened={opened} onClose={close} title="Add Keyboard" centered>
        <form onSubmit={handleSubmit(onSubmit)} onChange={handleInputChange}>
          <TextInput
            label="Name"
            placeholder="Name"
            mt="sm"
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
            <Button fullWidth type="submit" mt="sm" color="grape">
              Add Keyboard
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

      <Flex justify="end" pb="md">
        <Button onClick={open}>Add Keyboard</Button>
      </Flex>

      <Table.Root variant="surface" size={3} layout={"fixed"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {keyboardsData.map((keyboard) => (
            <KeyboardRow
              key={keyboard.keyboard_id}
              keyboard={keyboard}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              successMessage={successMessage}
              setSuccessMessage={setSuccessMessage}
              fetchKeyboardsData={fetchKeyboardsData}
              handleInputChange={handleInputChange}
            />
          ))}
        </Table.Body>
      </Table.Root>
    </Dashboard>
  );
};

export default Keyboards;
